-- 2026-10 pivot: make all content free for all users.
--
-- Context: we're redesigning the product around one-time content packages
-- (see subscription pivot 2026-07). While that's being built, every user
-- — paying, free, trial, or churned — should have access to every piece
-- of content.
--
-- APPROACH
-- --------
-- Flip three SECURITY DEFINER helpers so the gating logic they power
-- stops caring about subscription_tier. No RLS policies need to change
-- (they consume these helpers), no profile rows need to be rewritten
-- (subscription_tier/status columns keep their real historical values).
--
-- 1. user_tier_int()        → always returns 3 (goat equivalent)
--    Effect: RLS tier gates (`wp.tier <= public.user_tier_int()`) on
--    workout_plans, meal_plans, qb_trainings, and their descendants all
--    pass regardless of actual tier.
--
-- 2. user_plan_week()       → counts weeks since tier_upgraded_at OR
--    created_at, whichever exists. No `tier = 'free'` guard.
--    Effect: free users see week N content where N = weeks since signup.
--
-- 3. user_qb_training_week() → same as plan_week but anchored on
--    qb_training_started_at OR created_at.
--
-- REVERSAL
-- --------
-- To put the paywall gates back exactly as they were, re-run the original
-- bodies from these migrations (both repos have identical copies):
--   - workout_plans_tier_blocks_and_release.sql  (user_tier_int)
--   - add_birth_date_and_plan_week_helpers.sql   (user_plan_week)
--   - add_subscription_freeze_status_and_helpers.sql (user_qb_training_week)
--
-- NOT CHANGED BY THIS MIGRATION
-- -----------------------------
-- - Admin dashboard chart logic (still reads subscription_tier for revenue
--   accounting — this is correct; "all content free" doesn't mean we
--   relabel historical paying users).
-- - Client-side `tierSatisfies()` checks for GOAT-only UI (Coaching,
--   Film Breakdown). These are UI chrome; the underlying data is now
--   accessible. A follow-up web + mobile deploy can drop those gates.
-- - Stripe/Apple webhook preservation of comp_paused status (keep).
-- - New-signup paywall block (NEXT_PUBLIC_SUBSCRIPTIONS_PAUSED stays on).

BEGIN;

-- ── 1. user_tier_int: everyone is max tier ─────────────────────────────

CREATE OR REPLACE FUNCTION public.user_tier_int(user_uuid UUID DEFAULT auth.uid())
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Pivot: all content is free. Return the max tier so RLS gates pass
  -- for every authenticated caller. The user_uuid parameter is kept
  -- for signature compatibility with the original.
  SELECT 3;
$$;

GRANT EXECUTE ON FUNCTION public.user_tier_int(UUID) TO authenticated;

-- ── 2. user_plan_week: compute from any anchor, no tier guard ──────────

CREATE OR REPLACE FUNCTION public.user_plan_week(user_uuid UUID DEFAULT auth.uid())
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Pivot: no tier check. Anchor priority:
  --   1. tier_upgraded_at (preserves resume-from-week-N for users who
  --      had a comp_paused back-date applied)
  --   2. created_at (new free signups start counting from account birth)
  --   3. NOW() fallback (brand new row with no timestamps) → week 1
  SELECT GREATEST(
    1,
    FLOOR(
      EXTRACT(EPOCH FROM (
        NOW() - COALESCE(p.tier_upgraded_at, p.created_at, NOW())
      )) / 604800
    )::INT + 1
  )
  FROM public.profiles p
  WHERE p.id = user_uuid;
$$;

GRANT EXECUTE ON FUNCTION public.user_plan_week(UUID) TO authenticated;

-- ── 3. user_qb_training_week: same shape as plan_week ──────────────────

CREATE OR REPLACE FUNCTION public.user_qb_training_week(user_uuid UUID DEFAULT auth.uid())
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT GREATEST(
    1,
    FLOOR(
      EXTRACT(EPOCH FROM (
        NOW() - COALESCE(p.qb_training_started_at, p.created_at, NOW())
      )) / 604800
    )::INT + 1
  )
  FROM public.profiles p
  WHERE p.id = user_uuid;
$$;

GRANT EXECUTE ON FUNCTION public.user_qb_training_week(UUID) TO authenticated;

COMMIT;
