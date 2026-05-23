-- B-018: backfill tier_upgraded_at + qb_training_started_at for legacy paid users
--
-- ROOT CAUSE
-- -----------
-- F-001 (add_birth_date_and_plan_week_helpers.sql) introduced two timestamp
-- columns:
--   profiles.tier_upgraded_at          — drives user_plan_week()
--   profiles.qb_training_started_at    — drives user_qb_training_week()
--
-- Both columns were added with no DEFAULT and no backfill UPDATE. New
-- subscribers get them set by SuperwallTierSync._persistTier (Apple) or the
-- stripe-webhook Edge Function (Stripe) at upgrade time. But existing iOS
-- subscribers from BEFORE F-001 shipped have these columns = NULL.
--
-- The RLS gate on workout_plans + meal_plans is:
--   tier <= user_tier_int() AND week_of_release <= user_plan_week() AND age…
--
-- and user_plan_week() returns 0 when tier_upgraded_at IS NULL:
--   CASE WHEN p.subscription_tier = 'free' OR p.tier_upgraded_at IS NULL
--     THEN 0
--     ELSE FLOOR((NOW() - p.tier_upgraded_at) / 1 week)::INT + 1
--   END
--
-- So a legacy Legend user (subscription_tier='legend', tier_upgraded_at=NULL)
-- only sees plans whose week_of_release=0 — i.e. the free preview — and
-- nothing else. This is the bug "Legend tier no longer getting weekly
-- workout and nutrition plans."
--
-- FIX
-- ----
-- Backfill both columns to profile.created_at so the user is treated as if
-- they've been a member since signup. That gives them plan_week =
-- (weeks since signup) + 1, which unlocks every weekly plan authored up
-- through that point — exactly what they'd expect to see.
--
-- This is idempotent: it only writes when the column is NULL. Running it
-- twice does nothing the second time.

BEGIN;

UPDATE public.profiles
SET tier_upgraded_at = COALESCE(tier_upgraded_at, created_at, NOW())
WHERE subscription_tier IN ('starter', 'legend', 'goat')
  AND tier_upgraded_at IS NULL;

UPDATE public.profiles
SET qb_training_started_at = COALESCE(qb_training_started_at, tier_upgraded_at, created_at, NOW())
WHERE subscription_tier IN ('starter', 'legend', 'goat')
  AND qb_training_started_at IS NULL;

COMMIT;
