// One-shot setup script: creates the 2 QB Elite products + 4 prices
// in Stripe. Run with `node scripts/setup-stripe-products.mjs`.
//
// Idempotent on names — if the products already exist, skip them and
// just print the existing price IDs. Safe to re-run.
//
// Reads STRIPE_SECRET_KEY from .env.local.

import { config } from "dotenv";
import Stripe from "stripe";

config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const PRODUCTS = [
  {
    name: "QB Elite Starter",
    description:
      "Full quarterback training program for committed athletes. Weekly workout plans, meal plans, and live Huddles with coaches — built by trainers who've coached college and pro QBs.",
    marketing_features: [
      { name: "Weekly QB workout plan (mechanics, footwork, mobility, strength)" },
      { name: "Weekly meal plan built for QB performance" },
      { name: "Live group Huddles with coaches and pro QBs" },
      { name: "Full classroom + film library access" },
      { name: "Workout completion + favorites tracking" },
    ],
    prices: [
      { interval: "month", amount: 2999, lookupKey: "starter_monthly" },
      { interval: "year", amount: 29999, lookupKey: "starter_yearly" },
    ],
  },
  {
    name: "QB Elite Legend",
    description:
      "Everything in Starter, plus weekly live Film Breakdown Q&A with a coach and advanced film studies. The complete QB Elite experience.",
    marketing_features: [
      { name: "Everything in Starter" },
      { name: "Weekly live Film Breakdown Q&A with a coach" },
      { name: "Advanced film studies + game breakdowns" },
      { name: "Priority Huddle access" },
      { name: "1-on-1 form feedback on submitted clips" },
    ],
    prices: [
      { interval: "month", amount: 6999, lookupKey: "legend_monthly" },
      { interval: "year", amount: 69999, lookupKey: "legend_yearly" },
    ],
  },
];

const envOut = {};

for (const cfg of PRODUCTS) {
  // Find or create product
  const existing = await stripe.products.search({
    query: `name:"${cfg.name}" AND active:"true"`,
  });
  let product = existing.data[0];
  if (product) {
    console.log(`product exists: ${product.name} (${product.id})`);
    // Update description + features in case they changed
    product = await stripe.products.update(product.id, {
      description: cfg.description,
      marketing_features: cfg.marketing_features,
    });
  } else {
    product = await stripe.products.create({
      name: cfg.name,
      description: cfg.description,
      marketing_features: cfg.marketing_features,
    });
    console.log(`created product: ${product.name} (${product.id})`);
  }

  for (const p of cfg.prices) {
    // Look for an existing matching price by lookup_key
    const found = await stripe.prices.list({
      product: product.id,
      lookup_keys: [p.lookupKey],
      limit: 1,
    });
    let price = found.data[0];
    if (price) {
      console.log(`  price exists: ${p.lookupKey} (${price.id})`);
    } else {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: p.amount,
        currency: "usd",
        recurring: {
          interval: p.interval,
          trial_period_days: 7,
        },
        lookup_key: p.lookupKey,
      });
      console.log(`  created price: ${p.lookupKey} (${price.id})`);
    }
    const envKey = `NEXT_PUBLIC_STRIPE_PRICE_${p.lookupKey.toUpperCase()}`;
    envOut[envKey] = price.id;
  }
}

console.log("\n--- Paste into .env.local + Vercel ---");
for (const [k, v] of Object.entries(envOut)) {
  console.log(`${k}=${v}`);
}
