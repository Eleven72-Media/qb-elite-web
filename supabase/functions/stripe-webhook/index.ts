// Supabase Edge Function: stripe-webhook
//
// Receives Stripe webhook events and updates profiles.subscription_tier
// + timestamp columns via the SECURITY-DEFINER helpers in the
// add_subscription_freeze_status_and_helpers.sql migration:
//   - resume_or_start_subscription() handles new subs AND resubs (back-dates
//     tier_upgraded_at / qb_training_started_at from frozen_* if present).
//   - freeze_user_subscription() captures current plan_week + qb_week and
//     demotes tier to 'free' on cancel/expire.
//
// Mirrors the iOS SuperwallTierSync._persistTier shape so the data on a
// user's row looks identical regardless of Apple IAP vs Stripe origin.
//
// Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Secrets (set once via `supabase secrets set`):
//   STRIPE_SECRET_KEY                                 -- to fetch subscription details
//   STRIPE_WEBHOOK_SECRET                             -- to verify the signature
//   SUPABASE_SERVICE_ROLE_KEY                         -- to write to profiles (bypasses RLS)
//   NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY          -- tier lookup
//   NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY
//   NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY
//   NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY
//
// Stripe webhook endpoint (Dashboard → Developers → Webhooks):
//   URL:    https://<project>.functions.supabase.co/stripe-webhook
//   Events: customer.subscription.created
//           customer.subscription.updated
//           customer.subscription.deleted
//           checkout.session.completed

// deno-lint-ignore-file no-explicit-any

import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function tierForPriceId(
  priceId: string | null | undefined
): { tier: "starter" | "legend"; interval: "monthly" | "yearly" } | null {
  if (!priceId) return null;
  if (priceId === Deno.env.get("NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY"))
    return { tier: "starter", interval: "monthly" };
  if (priceId === Deno.env.get("NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY"))
    return { tier: "starter", interval: "yearly" };
  if (priceId === Deno.env.get("NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY"))
    return { tier: "legend", interval: "monthly" };
  if (priceId === Deno.env.get("NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY"))
    return { tier: "legend", interval: "yearly" };
  return null;
}

type SubscriptionStatus =
  | "pending"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

// Map Stripe's subscription.status to our six-value enum that powers the
// admin chart. Stripe's `paused` is rare on our setup — falls through to
// null which the caller treats as a no-op write.
function statusForStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus | null {
  switch (status) {
    case "trialing":      return "trialing";
    case "active":        return "active";
    case "past_due":      return "past_due";
    case "unpaid":        return "past_due"; // grace period
    case "canceled":      return "canceled";
    case "incomplete":    return "pending";
    case "incomplete_expired": return "expired";
    default:              return null;
  }
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

// Service-role client — bypasses RLS so we can update any user's row.
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

async function findUserIdByStripeCustomer(customerId: string): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

// Comp-paused users are hand-curated during the 2026-07 subscription
// pivot. Stripe webhook events (subscription.updated on the pause,
// subscription.deleted if the user or admin cancels, etc.) must NOT
// overwrite their subscription_status. Access stays unlocked via the
// back-dated anchors, so skipping the write is safe.
async function isCompPaused(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .maybeSingle();
  return (data as { subscription_status: string } | null)?.subscription_status
    === "comp_paused";
}

async function alreadyProcessed(eventId: string, eventType: string): Promise<boolean> {
  const { error } = await supabase
    .from("stripe_events")
    .insert({ id: eventId, type: eventType });
  if (!error) return false; // first insert wins
  return error.code === "23505"; // unique_violation
}

async function applySubscriptionToProfile(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const status = subscription.status;
  const mappedStatus = statusForStripeStatus(status);
  const isActiveLike =
    status === "active" || status === "trialing" || status === "past_due";

  if (!isActiveLike) {
    // Cancelled / unpaid / incomplete → freeze plan_week + qb_week into
    // frozen_* columns, demote tier to free, but keep subscription_source
    // populated for analytics. subscription_status reflects the true
    // Stripe state so the admin chart can distinguish recent churn from
    // never-subscribed.
    const { error } = await supabase.rpc("freeze_user_subscription", {
      p_user: userId,
      p_status: mappedStatus ?? "canceled",
    });
    if (error) console.error("freeze_user_subscription failed", error);
    // stripe_subscription_id is still useful on the row for support /
    // reactivation — leave it. (Previously we nulled it; F-006 keeps it.)
    return;
  }

  const price = subscription.items.data[0]?.price;
  const mapped = tierForPriceId(price?.id);
  if (!mapped) {
    console.warn(`stripe-webhook: unknown price_id ${price?.id} on subscription ${subscription.id}`);
    return;
  }

  // resume_or_start_subscription handles BOTH first-time activation AND
  // resubscribe-from-frozen. It back-dates tier_upgraded_at /
  // qb_training_started_at from frozen_* when present so user_plan_week()
  // and user_qb_training_week() pick up at the cancellation week, then
  // clears the frozen_* columns.
  const { error: rpcErr } = await supabase.rpc("resume_or_start_subscription", {
    p_user: userId,
    p_tier: mapped.tier,
    p_status: mappedStatus ?? "active",
    p_source: "stripe",
  });
  if (rpcErr) console.error("resume_or_start_subscription failed", rpcErr);

  // Stamp the Stripe subscription ID separately — the RPC doesn't know
  // about provider-specific columns.
  await supabase
    .from("profiles")
    .update({ stripe_subscription_id: subscription.id })
    .eq("id", userId);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("missing stripe-signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return new Response("invalid signature", { status: 400 });
  }

  // Idempotency: short-circuit if we've already handled this event.
  if (await alreadyProcessed(event.id, event.type)) {
    return new Response(JSON.stringify({ idempotent: true }), { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;
        if (userId && customerId) {
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("id", userId);
        }
        // Tier write happens on the subsequent customer.subscription.created
        // event — nothing else to do here.
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const userId =
          (subscription.metadata?.supabase_user_id as string | undefined) ??
          (await findUserIdByStripeCustomer(customerId));
        if (!userId) {
          console.warn(`stripe-webhook: no user for customer ${customerId}`);
          break;
        }
        if (await isCompPaused(userId)) {
          console.log(`stripe-webhook: ${event.type} skipped — user ${userId} is comp_paused`);
          break;
        }
        await applySubscriptionToProfile(userId, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const userId =
          (subscription.metadata?.supabase_user_id as string | undefined) ??
          (await findUserIdByStripeCustomer(customerId));
        if (!userId) break;
        if (await isCompPaused(userId)) {
          console.log(`stripe-webhook: subscription.deleted skipped — user ${userId} is comp_paused`);
          break;
        }
        const { error } = await supabase.rpc("freeze_user_subscription", {
          p_user: userId,
          p_status: "canceled",
        });
        if (error) console.error("freeze_user_subscription failed", error);
        break;
      }

      default:
        // Other events (invoice.payment_succeeded etc.) are
        // informational — we don't gate any state on them.
        break;
    }
  } catch (err) {
    console.error("stripe-webhook: handler error", err);
    return new Response("handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
