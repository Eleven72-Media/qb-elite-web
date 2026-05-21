import { NextResponse, type NextRequest } from "next/server";

import { priceIdFor, type SubscriptionInterval } from "@/lib/stripe/prices";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Creates a Stripe Checkout Session for the signed-in user.
 *
 * POST body:
 *   { tier: 'starter' | 'legend', interval: 'monthly' | 'yearly' }
 *
 * Returns: { url: string } — the hosted Checkout URL to redirect to.
 *
 * Flow:
 *   1. Authenticate caller via Supabase session cookie.
 *   2. Resolve or lazy-create the Stripe customer for this user
 *      (kept in profiles.stripe_customer_id so future Checkout Sessions
 *      reuse the same Stripe Customer record + saved payment methods).
 *   3. Create a Checkout Session with client_reference_id=user_id so
 *      the webhook can correlate the resulting subscription back to a
 *      Supabase user.
 *
 * The Stripe product itself encodes the 7-day trial (trial_period_days
 * was set at product creation time per the Sprint 4 checklist).
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tier = body.tier as "starter" | "legend" | undefined;
  const interval = body.interval as SubscriptionInterval | undefined;
  if (
    !tier ||
    !interval ||
    !["starter", "legend"].includes(tier) ||
    !["monthly", "yearly"].includes(interval)
  ) {
    return NextResponse.json(
      { error: "tier and interval are required" },
      { status: 400 }
    );
  }

  const priceId = priceIdFor(tier, interval);
  if (!priceId) {
    return NextResponse.json(
      { error: `Price not configured for ${tier} ${interval}` },
      { status: 500 }
    );
  }

  const stripe = getStripe();

  // Lazy-create the Stripe customer and persist the id on profiles so
  // we reuse it forever. Idempotent — only inserts if missing.
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, display_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const cached = profile as {
    stripe_customer_id: string | null;
    display_name: string | null;
    email: string | null;
  } | null;

  let customerId = cached?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: cached?.email ?? user.email ?? undefined,
      name: cached?.display_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    `https://${req.headers.get("host") ?? "qb-elite-web.vercel.app"}`;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: `${origin}/home?welcome=1&session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/paywall?canceled=1`,
    // Trial period comes from the Price object itself (configured in
    // Stripe dashboard), so we don't pass trial_period_days here —
    // double-setting would override the product config.
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe didn't return a Checkout URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
