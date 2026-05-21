// Supabase Edge Function: stripe-webhook
//
// Receives Stripe webhook events and updates profiles.subscription_tier
// + timestamp columns. Mirrors the iOS SuperwallTierSync._persistTier
// logic (qb_elite_source/lib/src/core/superwall/superwall_tier_sync.dart)
// so the data shape on the user's row looks identical regardless of
// whether they subscribed via Apple IAP or Stripe.
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

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

// Service-role client — bypasses RLS so we can update any user's row.
// Only used here; not exposed to the client.
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

async function alreadyProcessed(eventId: string, eventType: string): Promise<boolean> {
  const { error } = await supabase
    .from("stripe_events")
    .insert({ id: eventId, type: eventType });
  if (!error) return false; // first insert wins
  // 23505 = unique_violation = already processed
  return error.code === "23505";
}

async function applySubscriptionToProfile(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const status = subscription.status;
  const isActiveLike =
    status === "active" || status === "trialing" || status === "past_due";

  if (!isActiveLike) {
    // Cancelled / unpaid / incomplete → revert to free, keep timestamps
    // for analytics (mobile pattern leaves tier_upgraded_at populated).
    await supabase
      .from("profiles")
      .update({
        subscription_tier: "free",
        stripe_subscription_id: null,
        subscription_source: null,
      })
      .eq("id", userId);
    return;
  }

  const price = subscription.items.data[0]?.price;
  const mapped = tierForPriceId(price?.id);
  if (!mapped) {
    console.warn(`stripe-webhook: unknown price_id ${price?.id} on subscription ${subscription.id}`);
    return;
  }

  const nowIso = new Date().toISOString();

  // Read current profile so we can preserve qb_training_started_at when
  // it's already set. Mirrors SuperwallTierSync._persistTier exactly.
  const { data: current } = await supabase
    .from("profiles")
    .select("qb_training_started_at")
    .eq("id", userId)
    .maybeSingle();
  const curRow = current as { qb_training_started_at: string | null } | null;

  await supabase
    .from("profiles")
    .update({
      subscription_tier: mapped.tier,
      subscription_source: "stripe",
      stripe_subscription_id: subscription.id,
      tier_upgraded_at: nowIso,
      qb_training_started_at: curRow?.qb_training_started_at ?? nowIso,
    })
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
          // Backfill stripe_customer_id in case the lazy-create on the
          // route handler raced ahead of the webhook (unlikely but
          // possible if Stripe fires before our local update lands).
          await supabase
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("id", userId);
        }
        // The actual tier write happens via the subsequent
        // customer.subscription.created event, so nothing else to do here.
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
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            stripe_subscription_id: null,
            subscription_source: null,
          })
          .eq("id", userId);
        break;
      }

      default:
        // Other events (invoice.payment_succeeded etc.) are
        // informational — we don't gate any state on them.
        break;
    }
  } catch (err) {
    console.error("stripe-webhook: handler error", err);
    // Return 500 so Stripe retries.
    return new Response("handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
