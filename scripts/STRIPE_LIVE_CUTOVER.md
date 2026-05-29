# Stripe LIVE cutover runbook

How to flip qbeliteapp.com from Stripe test mode to live. ~20 minutes
end-to-end. All steps the agent can guide; **only the human can click
the actual buttons** (it's a destructive shared-state change).

---

## 0. Prereqs

- Stripe account business profile is **fully verified** — legal name,
  support email, business address, bank account (where payouts land),
  tax info. Stripe will not enable Live until this is done. Settings
  → Business → Public details + Bank accounts and scheduling.
- Local `.env.local` has the **test** secret key in `STRIPE_SECRET_KEY`
  (it does — this is how the dev environment works today).

---

## 1. Toggle the dashboard to Live

Top-left of the Stripe dashboard, flip the **"View test data"**
toggle off (or click the workspace switcher → Live). Everything you
do from here happens in Live until you toggle back.

---

## 2. Create the 4 Live products + prices

Bring the same products from test → live by re-running the
idempotent setup script with the **live** secret key:

```bash
cd qb_elite_web

# 1. Grab a live key from Stripe → Developers → API keys → Secret key.
#    (Restricted key with write permissions on Products + Prices is fine.)
# 2. Temporarily put it in .env.local under STRIPE_SECRET_KEY=sk_live_...
#    (DO NOT commit this — .env.local is gitignored.)
# 3. Run:
node scripts/setup-stripe-products.mjs
```

Output: 4 fresh `price_*` IDs printed for Starter monthly / Starter
yearly / Legend monthly / Legend yearly. **Copy them somewhere
durable** — you'll need them in step 5.

The script reuses existing products by name, so re-running is safe.

---

## 3. Register the Live webhook

Same flow, second script:

```bash
node scripts/register-stripe-webhook.mjs
```

This points a webhook at the existing Supabase Edge Function URL
(`https://rujqxxrcxsrgklqvcotr.functions.supabase.co/stripe-webhook`)
and prints a new **signing secret** (`whsec_...`). Copy it.

The script is idempotent on URL match.

---

## 4. Grab the live publishable key

Stripe → Developers → API keys → **Publishable key** (`pk_live_...`).
Copy it.

---

## 5. Swap env vars in two places

Same set of variables, same values, two destinations.

### Vercel (qb-elite-web project → Settings → Environment Variables)

Switch each to the **Production** environment:

| Variable | New value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from step 3) |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY` | live price ID from step 2 |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY` | live price ID from step 2 |
| `NEXT_PUBLIC_STRIPE_PRICE_LEGEND_MONTHLY` | live price ID from step 2 |
| `NEXT_PUBLIC_STRIPE_PRICE_LEGEND_YEARLY` | live price ID from step 2 |

**Trigger a redeploy** so the new env values land in the running
build: Vercel → Deployments → latest → "..." → Redeploy.

### Supabase (Edge Function env)

The webhook Edge Function reads from its own env, not Vercel's.
Supabase dashboard → Project → Edge Functions → `stripe-webhook` →
Manage secrets (or Settings → Functions → Environment variables).

Set the **same seven values** there. The function reads:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY` … `_LEGEND_YEARLY`
- (`SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are already wired
  and unchanged.)

No code redeploy needed — Edge Function secrets are read at request
time.

---

## 6. Smoke test before announcing

Do this from the real production URL (`qbeliteapp.com`) so cached env
isn't a confounder:

1. **Sign up** a brand-new account (use a real email you control).
2. **Hit the paywall** → pick Starter monthly → complete with a
   **real card** (small charge — you'll refund it).
3. Confirm the redirect lands on `/home` and your profile shows the
   correct tier. Open Supabase → Table editor → `profiles` → find your
   row → `subscription_tier = 'starter'`, `tier_upgraded_at` stamped,
   `stripe_subscription_id` populated.
4. Stripe dashboard → Customers → find your row → confirm the
   subscription is on **Live**, not Test.
5. **Cancel** via Customer Portal (Profile → Subscription → Manage).
6. Wait ~5 seconds and re-check `profiles` → `subscription_tier = 'free'`.
7. **Refund** the smoke-test charge in the Stripe dashboard.

If any of those fail, the runtime log lives at:

- **Vercel**: Dashboard → Logs (server functions) for `/api/stripe/checkout`
  and `/api/stripe/portal`.
- **Supabase**: Edge Functions → `stripe-webhook` → Logs.

---

## 7. Update BACKLOG

- [ ] Mark B-031 / task #76 resolved with the cutover date.
- [ ] Remove the local `.env.local` `sk_live_*` if you don't need it
      locally (dev should keep using `sk_test_*` to avoid accidental
      live charges). Restore the test key.

---

## Rollback

If something breaks badly, revert env vars to the previous test
values in Vercel + Supabase and redeploy. The Live products + webhook
in Stripe can stay — they're inert without the matching env config.
