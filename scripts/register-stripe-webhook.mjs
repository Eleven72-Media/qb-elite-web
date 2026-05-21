// Registers the Supabase Edge Function as a Stripe webhook endpoint.
// Idempotent — if an endpoint with the same URL already exists, it's
// reused. Prints the signing secret for setting as STRIPE_WEBHOOK_SECRET.

import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const WEBHOOK_URL =
  "https://rujqxxrcxsrgklqvcotr.functions.supabase.co/stripe-webhook";

const EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

const existing = await stripe.webhookEndpoints.list({ limit: 100 });
let endpoint = existing.data.find((e) => e.url === WEBHOOK_URL);

if (endpoint) {
  console.log(`webhook exists: ${endpoint.id}`);
  endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
    enabled_events: EVENTS,
  });
  console.log(`updated enabled_events on ${endpoint.id}`);
} else {
  endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: EVENTS,
    description: "QB Elite PWA — Supabase Edge Function",
  });
  console.log(`created webhook: ${endpoint.id}`);
}

console.log("\n--- STRIPE_WEBHOOK_SECRET ---");
console.log(endpoint.secret ?? "(secret only shown on create — already retrieved)");
console.log("-----------------------------\n");
console.log("Set this as STRIPE_WEBHOOK_SECRET on:");
console.log("  - Supabase Edge Function secrets");
console.log("  - Vercel env vars (Production + Preview + Development)");
