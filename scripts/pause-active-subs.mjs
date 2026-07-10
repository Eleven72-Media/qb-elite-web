// One-shot script: pauses collection on every Stripe subscription
// belonging to a paying Starter/Legend user in the comp cohort.
//
// pause_collection.behavior='void' voids any invoice generated during
// the pause window (no charges, no unpaid invoices piling up). To
// unpause later:
//   await stripe.subscriptions.update(id, { pause_collection: '' });
// which drops the pause and resumes normal billing on the next cycle.
//
// Idempotent — if a sub is already paused it re-applies the same pause
// (Stripe is fine with this). Prints a per-sub result line.
//
// Prereqs:
//   1. .env.local has STRIPE_SECRET_KEY=sk_live_... (LIVE mode).
//   2. Cohort has been marked via the access-grant migration first
//      (subscription_status='comp_paused'), so this script's SELECT
//      finds them.
//
// Usage:
//   cd qb_elite_web
//   node scripts/pause-active-subs.mjs
//
// Reversal: node scripts/pause-active-subs.mjs --unpause

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

config({ path: ".env.local" });

const UNPAUSE = process.argv.includes("--unpause");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

// Service-role client so we can bypass RLS on the profiles SELECT.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function main() {
  const mode = UNPAUSE ? "UNPAUSE" : "PAUSE";
  console.log(`\n=== ${mode} Stripe subscriptions in comp cohort ===\n`);

  // Pull every Stripe user in the comped cohort. Note we key off
  // subscription_status='comp_paused' — set by the access-grant migration.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, subscription_tier, stripe_subscription_id")
    .eq("subscription_source", "stripe")
    .eq("subscription_status", "comp_paused")
    .not("stripe_subscription_id", "is", null);

  if (error) {
    console.error("Supabase query failed:", error.message);
    process.exit(1);
  }

  if (!data.length) {
    console.log(
      "No Stripe subs in the comp_paused cohort. Did you run the access-grant migration first?",
    );
    return;
  }

  console.log(`Found ${data.length} Stripe subscription(s) to ${mode.toLowerCase()}.\n`);

  let ok = 0;
  let failed = 0;
  for (const row of data) {
    try {
      if (UNPAUSE) {
        await stripe.subscriptions.update(row.stripe_subscription_id, {
          pause_collection: "",
        });
        console.log(`✓ Unpaused ${row.email} (${row.stripe_subscription_id})`);
      } else {
        await stripe.subscriptions.update(row.stripe_subscription_id, {
          pause_collection: { behavior: "void" },
        });
        console.log(`✓ Paused ${row.email} (${row.stripe_subscription_id})`);
      }
      ok++;
    } catch (err) {
      console.error(
        `✗ Failed ${row.email} (${row.stripe_subscription_id}): ${err.message}`,
      );
      failed++;
    }
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
