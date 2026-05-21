import Stripe from "stripe";

/**
 * Server-only Stripe client.
 *
 * STRIPE_SECRET_KEY lives in Vercel env vars (preview + production) and
 * the local .env.local — never in the client bundle. Importing this
 * module from a client component will throw at build time.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    // Pinning the API version keeps webhook payload shapes stable
    // across Stripe's monthly updates. Bump after testing.
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}
