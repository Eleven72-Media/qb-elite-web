-- F-006: subscription status + freeze/resume + user_week helper.
--
-- This migration is the schema backbone for:
--   1. The "Subscribers by Source" chart in admin getting a real trial / grace /
--      canceled breakdown instead of the directional heuristic we shipped first.
--   2. Webhooks (Stripe + Apple Server Notifications V2) finally being able to
--      DEMOTE a row to subscription_tier='free' when a sub expires, instead of
--      leaving stale "paying" rows that pile up as ghosts.
--   3. Freeze-on-cancel / resume-on-resub semantics for user_plan_week() and
--      user_qb_training_week(): a user who cancels at week 5 sees week 0 free
--      content while they're not paying, and when they re-subscribe later they
--      pick up at week 5 instead of restarting at week 1.
--   4. A new user_week() helper that counts weeks since account creation,
--      forever, regardless of subscription tier. Useful for lifecycle email +
--      "you've been here X weeks" UX.
--
-- All adds are idempotent (IF NOT EXISTS) and reversible by dropping the new
-- columns/functions — existing read paths are untouched until the webhooks
-- start writing the new fields.

BEGIN;

-- ── 1. Profile columns ──────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS apple_original_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS frozen_plan_week INT,
  ADD COLUMN IF NOT EXISTS frozen_qb_week INT;

-- Apple's originalTransactionId is the stable join key for App Store Server
-- Notifications V2 — Apple sends it on every notification, so we keep it
-- unique so we can map an incoming notification back to a single user row.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'profiles_apple_original_transaction_id_key'
  ) THEN
    CREATE UNIQUE INDEX profiles_apple_original_transaction_id_key
      ON public.profiles (apple_original_transaction_id)
      WHERE apple_original_transaction_id IS NOT NULL;
  END IF;
END$$;

COMMENT ON COLUMN public.profiles.subscription_status IS
  'Lifecycle state from the payment provider. One of: pending, trialing, active, past_due, canceled, expired. NULL for users who have never had a paid subscription.';
COMMENT ON COLUMN public.profiles.apple_original_transaction_id IS
  'Apple App Store originalTransactionId. Stable across renewals and family-sharing. Used by the apple-notifications Edge Function to map incoming ASSN v2 events back to a profile row.';
COMMENT ON COLUMN public.profiles.frozen_plan_week IS
  'Plan week captured at the moment of cancel/expire. NULL when actively paying. On re-subscribe, the webhook back-dates tier_upgraded_at so user_plan_week() resumes at this value, then clears the column.';
COMMENT ON COLUMN public.profiles.frozen_qb_week IS
  'QB training week captured at cancel/expire. Same freeze/resume contract as frozen_plan_week.';

-- ── 2. user_week() helper ───────────────────────────────────────────────

-- Counts weeks since the account was created. Never resets, never cares
-- about subscription state. Mirrors the 1-indexed shape of the other
-- week helpers (NOW() on signup day = week 1).
CREATE OR REPLACE FUNCTION public.user_week(user_uuid UUID DEFAULT auth.uid())
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN p.created_at IS NULL THEN 0
    ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 604800)::INT + 1
  END
  FROM public.profiles p
  WHERE p.id = user_uuid;
$$;

GRANT EXECUTE ON FUNCTION public.user_week(UUID) TO authenticated;

-- ── 3. Tighten user_qb_training_week() to gate on tier ──────────────────

-- Existing definition returned weeks-since-qb_training_started_at even when
-- the user was free, which would let RLS week checks pass for a churned user
-- (tier checks still blocked them, but defense-in-depth is cheap). Match
-- user_plan_week's "free → 0" guard.
CREATE OR REPLACE FUNCTION public.user_qb_training_week(user_uuid UUID DEFAULT auth.uid())
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN p.subscription_tier = 'free' OR p.qb_training_started_at IS NULL THEN 0
    ELSE FLOOR(EXTRACT(EPOCH FROM (NOW() - p.qb_training_started_at)) / 604800)::INT + 1
  END
  FROM public.profiles p
  WHERE p.id = user_uuid;
$$;

-- ── 4. freeze / resume helpers (called from webhooks) ───────────────────

-- Captures current plan_week + qb_training_week into frozen_* columns, then
-- demotes tier to 'free' and stamps subscription_status. Called from both
-- the stripe-webhook and apple-notifications Edge Functions when a sub
-- transitions out of an active state.
CREATE OR REPLACE FUNCTION public.freeze_user_subscription(
  p_user UUID,
  p_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_week INT;
  v_qb_week INT;
BEGIN
  -- Compute BEFORE demoting — the helpers return 0 for free-tier users.
  v_plan_week := public.user_plan_week(p_user);
  v_qb_week   := public.user_qb_training_week(p_user);

  UPDATE public.profiles
  SET
    subscription_tier   = 'free',
    subscription_status = p_status,
    -- Preserve an existing frozen value if one is already set (e.g. a
    -- double-cancel event). The first freeze wins so we don't overwrite
    -- a real frozen week with the post-demotion 0.
    frozen_plan_week    = COALESCE(frozen_plan_week, NULLIF(v_plan_week, 0)),
    frozen_qb_week      = COALESCE(frozen_qb_week, NULLIF(v_qb_week, 0))
  WHERE id = p_user;
END;
$$;

GRANT EXECUTE ON FUNCTION public.freeze_user_subscription(UUID, TEXT) TO service_role;

-- Promotes tier to the new value and either back-dates tier_upgraded_at /
-- qb_training_started_at from a stored frozen value, or stamps NOW() if
-- this is a fresh subscription. Either way, clears the frozen_* columns.
CREATE OR REPLACE FUNCTION public.resume_or_start_subscription(
  p_user UUID,
  p_tier TEXT,
  p_status TEXT,
  p_source TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_frozen_plan INT;
  v_frozen_qb INT;
  v_existing_qb TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  SELECT frozen_plan_week, frozen_qb_week, qb_training_started_at
    INTO v_frozen_plan, v_frozen_qb, v_existing_qb
    FROM public.profiles
   WHERE id = p_user;

  UPDATE public.profiles
  SET
    subscription_tier   = p_tier,
    subscription_status = p_status,
    subscription_source = p_source,
    tier_upgraded_at = CASE
      WHEN v_frozen_plan IS NOT NULL AND v_frozen_plan > 0
        THEN v_now - ((v_frozen_plan - 1) * INTERVAL '7 days')
      ELSE v_now
    END,
    qb_training_started_at = CASE
      WHEN v_frozen_qb IS NOT NULL AND v_frozen_qb > 0
        THEN v_now - ((v_frozen_qb - 1) * INTERVAL '7 days')
      WHEN v_existing_qb IS NULL
        THEN v_now
      ELSE v_existing_qb
    END,
    frozen_plan_week = NULL,
    frozen_qb_week   = NULL
  WHERE id = p_user;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resume_or_start_subscription(UUID, TEXT, TEXT, TEXT) TO service_role;

-- ── 5. Backfill subscription_status from current tier ───────────────────

-- One-time seed. Everyone non-free is assumed 'active' (the ghosts already
-- cleaned up in the prior manual demotion). The webhook will overwrite to
-- the true value (trialing / past_due / etc.) on the next event.
UPDATE public.profiles
SET subscription_status = CASE
  WHEN subscription_tier = 'free' THEN NULL
  ELSE 'active'
END
WHERE subscription_status IS NULL;

COMMIT;
