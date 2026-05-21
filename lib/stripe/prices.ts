import type { SubscriptionTier } from "@/types/db";

/**
 * Stripe price ID ↔ tier mapping.
 *
 * Price IDs come from the Stripe dashboard once the 4 products are
 * created. They're env-var driven so test/prod can use different
 * Stripe accounts without redeploying.
 *
 * Required env vars (set in .env.local + Vercel):
 *   NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY
 *   NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY
 *   NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY
 *   NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY
 *
 * NEXT_PUBLIC_ prefix is required because we render the paywall on the
 * client and need to pass the right price_id to the Checkout Session
 * creator. Price IDs are not secret — they're shown in the URL of any
 * Stripe-hosted Checkout session.
 */

export type SubscriptionInterval = "monthly" | "yearly";

export interface PaywallTier {
  tier: SubscriptionTier;
  interval: SubscriptionInterval;
  priceId: string;
  displayPrice: string;
}

export const TIER_PRICING = {
  starter: {
    monthly: { price: "$29.99/mo", env: "NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY" },
    yearly: { price: "$299.99/yr", env: "NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY" },
  },
  legend: {
    monthly: { price: "$69.99/mo", env: "NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY" },
    yearly: { price: "$699.99/yr", env: "NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY" },
  },
} as const;

export function priceIdFor(
  tier: "starter" | "legend",
  interval: SubscriptionInterval
): string | null {
  const envName = TIER_PRICING[tier][interval].env;
  return process.env[envName] ?? null;
}

/**
 * Reverse lookup — given a Stripe price_id from a webhook event, figure
 * out which tier it corresponds to. Used by the stripe-webhook Edge
 * Function to write the right `subscription_tier` to profiles.
 *
 * Env vars are read from the Edge Function's runtime, where Deno
 * exposes process.env via the Supabase Edge runtime polyfill.
 */
export function tierForPriceId(
  priceId: string
): { tier: SubscriptionTier; interval: SubscriptionInterval } | null {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY)
    return { tier: "starter", interval: "monthly" };
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY)
    return { tier: "starter", interval: "yearly" };
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY)
    return { tier: "legend", interval: "monthly" };
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY)
    return { tier: "legend", interval: "yearly" };
  return null;
}
