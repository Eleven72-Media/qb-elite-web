-- F-005: Stripe billing parity columns on profiles.
--
-- The Stripe webhook (supabase/functions/stripe-webhook) writes to the
-- same `subscription_tier` column the mobile SuperwallTierSync writes
-- to — these new columns let us tell *which* billing system is the
-- current source of truth and avoid double-charging confusion in
-- support flows.
--
-- Existing iOS IAP subscribers are backfilled as 'apple' so they're
-- not mistakenly treated as needing a Stripe customer record.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_source TEXT
    CHECK (subscription_source IN ('apple', 'google', 'stripe')),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

COMMENT ON COLUMN public.profiles.subscription_source IS
  'Which billing system owns this user''s subscription_tier. Set by SuperwallTierSync (apple|google) or stripe-webhook (stripe). NULL = free tier.';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS
  'Stripe Customer ID, lazily created on first Checkout. UNIQUE so a customer never gets duplicated.';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS
  'Active Stripe Subscription ID. Updated by stripe-webhook on subscription.created/updated, cleared on subscription.deleted.';

-- Backfill: any non-free user without a source is assumed to be on
-- Apple (the existing mobile/IAP flow). Done so support queries
-- ("which billing source?") return clean answers from day one.
UPDATE public.profiles
SET subscription_source = 'apple'
WHERE subscription_tier IN ('starter', 'legend', 'goat')
  AND subscription_source IS NULL;

COMMIT;
