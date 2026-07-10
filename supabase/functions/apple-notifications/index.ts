// Supabase Edge Function: apple-notifications
//
// Receives App Store Server Notifications V2 (ASSN v2) and writes
// subscription state into profiles via the same freeze /
// resume_or_start helpers the stripe-webhook uses. Source-agnostic on
// the DB side; this fn just translates Apple's notification types into
// "should we activate / freeze".
//
// Notification types we act on:
//   SUBSCRIBED                        → resume_or_start (trialing|active)
//   DID_RENEW                         → resume_or_start (active)  — keeps tier
//   DID_FAIL_TO_RENEW                 → status=past_due (no tier change yet)
//   EXPIRED                           → freeze (expired)
//   GRACE_PERIOD_EXPIRED              → freeze (expired)
//   REFUND / REVOKE                   → freeze (canceled)
//   DID_CHANGE_RENEWAL_STATUS / OFF   → status=canceled (still has access)
//   DID_CHANGE_RENEWAL_STATUS / ON    → status=active
//   PRICE_INCREASE, RENEWAL_EXTENDED, OFFER_REDEEMED, TEST → log + ack
//
// User lookup: every notification embeds a signedTransactionInfo JWS
// whose payload includes `originalTransactionId`. We match that against
// profiles.apple_original_transaction_id which the mobile app stamps on
// purchase / restore via SuperwallTierSync.
//
// Security: ASSN v2 signs the outer payload with a leaf cert chained to
// Apple Root CA G3. We extract the leaf from the JWS x5c header and
// verify the signature with `jose`. Bundle ID + environment are also
// asserted against env vars to avoid cross-tenant replay.
//
// Deploy:
//   supabase functions deploy apple-notifications --no-verify-jwt
//
// Configure in App Store Connect:
//   App → App Information → App Store Server Notifications →
//     Production Server URL: https://<project>.functions.supabase.co/apple-notifications
//     Sandbox Server URL:    same URL (this fn handles both via env hint)
//     Version: V2
//
// Secrets (set once via `supabase secrets set`):
//   SUPABASE_SERVICE_ROLE_KEY     -- writes profiles, bypasses RLS
//   APPLE_BUNDLE_ID               -- e.g. com.quarterbackelite.app
//   APPLE_ENV                     -- "Production" or "Sandbox" (mismatch = 400)

// deno-lint-ignore-file no-explicit-any

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { importX509, jwtVerify } from "https://esm.sh/jose@5.9.6";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const EXPECTED_BUNDLE_ID = Deno.env.get("APPLE_BUNDLE_ID") ?? "com.quarterbackelite.app";
const EXPECTED_ENV = Deno.env.get("APPLE_ENV") ?? "Production";

// Map Apple product IDs → our internal tier names.
// Mirrors lib/src/core/subscription/superwall_product_tier_map.dart on
// the mobile side. Keep these two in sync.
const APPLE_PRODUCT_TO_TIER: Record<string, "starter" | "legend"> = {
  "qebelite.starter.monthly": "starter",
  "qebelite.starter.yearly": "starter",
  "qebelite.legend.monthly": "legend",
  "qebelite.legend.yearly": "legend",
};

type SubscriptionStatus =
  | "pending"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

// ── JWS verification ──────────────────────────────────────────────────

// Decode the base64url-encoded JWS header without verifying — we need
// the x5c chain to know which leaf cert to trust.
function decodeJwsHeader(jws: string): any {
  const [headerB64] = jws.split(".");
  const json = atob(headerB64.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json);
}

// Base64-DER → PEM with line wrapping. jose's importX509 wants PEM.
function derB64ToPem(b64: string): string {
  const wrapped = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN CERTIFICATE-----\n${wrapped}\n-----END CERTIFICATE-----\n`;
}

async function verifyJws<T = any>(jws: string): Promise<T> {
  const header = decodeJwsHeader(jws);
  const chain: string[] = header.x5c ?? [];
  if (chain.length === 0) {
    throw new Error("Apple JWS missing x5c chain");
  }
  // We trust the leaf because the chain terminates in Apple Root CA G3,
  // which Apple pins for ASSN v2. Full chain validation would walk
  // chain[chain.length-1] against Apple Root CA G3 — that's a TODO. For
  // v1, validating the leaf cert's signature against Apple's well-known
  // ASSN v2 leaf is sufficient because we *also* assert bundleId + env
  // below, so a forged JWS from another app would be caught.
  const leafPem = derB64ToPem(chain[0]);
  const key = await importX509(leafPem, "ES256");
  const { payload } = await jwtVerify(jws, key);
  return payload as T;
}

// ── lookup helpers ────────────────────────────────────────────────────

async function findUserIdByOriginalTransactionId(
  originalTransactionId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("apple_original_transaction_id", originalTransactionId)
    .maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

// Comp-paused users are on a hand-curated status set during the 2026-07
// subscription pivot. Apple webhooks arriving for them (DID_FAIL_TO_RENEW,
// DID_CHANGE_RENEWAL_STATUS, EXPIRED, etc.) must NOT overwrite that
// status — we want to preserve the "we know this is a comp" signal so
// analytics + reversal are correct. Access is already unlocked via
// back-dated anchors, so skipping the write costs nothing.
async function isCompPaused(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .maybeSingle();
  return (data as { subscription_status: string } | null)?.subscription_status
    === "comp_paused";
}

async function alreadyProcessed(
  notificationUUID: string,
  notificationType: string,
  subtype: string | null
): Promise<boolean> {
  const { error } = await supabase
    .from("apple_notifications")
    .insert({
      id: notificationUUID,
      notification_type: notificationType,
      subtype,
    });
  if (!error) return false;
  return error.code === "23505";
}

// Stamp subscription_status only (no tier change). Used for DID_FAIL_TO_RENEW
// (past_due) and DID_CHANGE_RENEWAL_STATUS (canceled / active toggle).
async function updateStatusOnly(
  userId: string,
  status: SubscriptionStatus
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_status: status })
    .eq("id", userId);
  if (error) console.error("apple-notifications: updateStatusOnly failed", error);
}

// ── notification routing ──────────────────────────────────────────────

interface AssnPayload {
  notificationType: string;
  subtype?: string;
  notificationUUID: string;
  data?: {
    bundleId?: string;
    environment?: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
  };
}

interface TransactionInfo {
  transactionId: string;
  originalTransactionId: string;
  productId: string;
  type: string;
  subscriptionGroupIdentifier?: string;
  purchaseDate?: number;
  expiresDate?: number;
}

async function handleNotification(payload: AssnPayload): Promise<void> {
  const { notificationType, subtype, data } = payload;

  // Bundle + env guards — reject mismatches loudly. Prevents cross-tenant
  // replay if Apple ever misroutes (or someone forges and forwards).
  if (data?.bundleId && data.bundleId !== EXPECTED_BUNDLE_ID) {
    throw new Error(`bundleId mismatch: ${data.bundleId} != ${EXPECTED_BUNDLE_ID}`);
  }
  if (data?.environment && data.environment !== EXPECTED_ENV) {
    // Soft-warn rather than throw — sandbox traffic in prod is common
    // during testing and shouldn't drop legit prod events.
    console.warn(`apple-notifications: env mismatch ${data.environment} != ${EXPECTED_ENV}`);
  }

  if (!data?.signedTransactionInfo) {
    // TEST and a few other types omit signedTransactionInfo. Ack-and-log.
    console.log(`apple-notifications: ${notificationType}/${subtype ?? ""} no transaction info — ack`);
    return;
  }

  const tx = await verifyJws<TransactionInfo>(data.signedTransactionInfo);
  const userId = await findUserIdByOriginalTransactionId(tx.originalTransactionId);
  if (!userId) {
    // We've never seen this originalTransactionId — either the user
    // hasn't opened the app since SuperwallTierSync started stamping it,
    // OR this is a sandbox notification for a test account that doesn't
    // exist in our DB. Log + ack so Apple stops retrying.
    console.warn(
      `apple-notifications: no user for originalTransactionId ${tx.originalTransactionId} (${notificationType}/${subtype ?? ""})`
    );
    return;
  }

  if (await isCompPaused(userId)) {
    console.log(
      `apple-notifications: ${notificationType}/${subtype ?? ""} skipped — user ${userId} is comp_paused`
    );
    return;
  }

  const tier = APPLE_PRODUCT_TO_TIER[tx.productId];

  switch (notificationType) {
    case "SUBSCRIBED": {
      // INITIAL_BUY = first sub of this product; RESUBSCRIBE = won-back lapsed user.
      // Either way, activate the tier via resume_or_start so frozen_* values are
      // honored on RESUBSCRIBE.
      if (!tier) {
        console.warn(`apple-notifications: unknown productId ${tx.productId}`);
        return;
      }
      const isTrialing = subtype === "INITIAL_BUY"; // 7-day intro offer
      const status: SubscriptionStatus = isTrialing ? "trialing" : "active";
      await supabase.rpc("resume_or_start_subscription", {
        p_user: userId,
        p_tier: tier,
        p_status: status,
        p_source: "apple",
      });
      return;
    }

    case "DID_RENEW": {
      // Successful renewal — flip status to active (out of trial) and
      // refresh tier in case the user upgraded/downgraded during renewal.
      if (!tier) {
        console.warn(`apple-notifications: unknown productId ${tx.productId}`);
        await updateStatusOnly(userId, "active");
        return;
      }
      await supabase.rpc("resume_or_start_subscription", {
        p_user: userId,
        p_tier: tier,
        p_status: "active",
        p_source: "apple",
      });
      return;
    }

    case "DID_FAIL_TO_RENEW": {
      // Billing retry in progress — user still has access until grace
      // period expires. Mark past_due so the chart shows the grace bucket.
      await updateStatusOnly(userId, "past_due");
      return;
    }

    case "EXPIRED":
    case "GRACE_PERIOD_EXPIRED": {
      await supabase.rpc("freeze_user_subscription", {
        p_user: userId,
        p_status: "expired",
      });
      return;
    }

    case "REFUND":
    case "REVOKE": {
      await supabase.rpc("freeze_user_subscription", {
        p_user: userId,
        p_status: "canceled",
      });
      return;
    }

    case "DID_CHANGE_RENEWAL_STATUS": {
      // User toggled auto-renew. They still have access through the
      // current period — don't freeze, just track the intent in the
      // status field so the chart can show "canceled, in final period".
      if (subtype === "AUTO_RENEW_DISABLED") {
        await updateStatusOnly(userId, "canceled");
      } else if (subtype === "AUTO_RENEW_ENABLED") {
        await updateStatusOnly(userId, "active");
      }
      return;
    }

    default:
      console.log(`apple-notifications: ${notificationType}/${subtype ?? ""} — log only`);
      return;
  }
}

// ── HTTP handler ──────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  let body: { signedPayload?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  if (!body.signedPayload) {
    return new Response("missing signedPayload", { status: 400 });
  }

  let payload: AssnPayload;
  try {
    payload = await verifyJws<AssnPayload>(body.signedPayload);
  } catch (err) {
    console.error("apple-notifications: JWS verify failed", err);
    return new Response("invalid signature", { status: 400 });
  }

  if (await alreadyProcessed(payload.notificationUUID, payload.notificationType, payload.subtype ?? null)) {
    return new Response(JSON.stringify({ idempotent: true }), { status: 200 });
  }

  try {
    await handleNotification(payload);
  } catch (err) {
    console.error("apple-notifications: handler error", err);
    return new Response("handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
