-- B-019: drop the week_of_release gate so paid users see every published plan
--
-- BACKGROUND
-- -----------
-- F-002 (workout) + F-003 (meal) wrote RLS that gated visibility by BOTH
-- tier AND a cohort-based week counter:
--
--   tier <= user_tier_int()
--   AND week_of_release <= user_plan_week()    -- THE PROBLEM CLAUSE
--   AND age range matches
--
-- user_plan_week() returns "weeks since the user upgraded". So a Legend
-- user who upgraded 3 days ago sees week_of_release ≤ 1 plans only. The
-- admin keeps publishing fresh plans monotonically (week 1, 2, … 20),
-- which means new subscribers permanently see only the OLDEST week of
-- content, even though admin has published a current week.
--
-- Symptom report: "Legend tier is no longer getting the weekly workout
-- and nutrition plans." Diagnostic confirmed every Legend user has a
-- small but non-zero visible_count — they're stuck on week 1.
--
-- FIX
-- ----
-- Drop the week_of_release clause. Paid users now see every plan that
-- matches their tier + age. The PWA + Flutter clients both pick the
-- highest week_of_release to render, so users automatically land on the
-- latest published week. Past weeks remain accessible for the
-- week-back navigator UI.
--
-- Unchanged:
--   - is_admin() bypass (admins see everything)
--   - week_of_release = 0 bypass (free preview still works for free tier)
--   - tier <= user_tier_int() (Starter doesn't see Legend content)
--   - age range checks (still respected)
--
-- Free users (user_tier_int = 0) still only see week_of_release = 0
-- plans because the tier check rejects everything else.

BEGIN;

-- ── workout_plans + descendants ─────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated read workout_plans (gated)" ON public.workout_plans;
DROP POLICY IF EXISTS "Authenticated read workout_plan_weeks (gated)" ON public.workout_plan_weeks;
DROP POLICY IF EXISTS "Authenticated read workout_plan_days (gated)" ON public.workout_plan_days;
DROP POLICY IF EXISTS "Authenticated read workout_plan_exercises (gated)" ON public.workout_plan_exercises;
DROP POLICY IF EXISTS "Authenticated read workout_plan_blocks (gated)" ON public.workout_plan_blocks;

CREATE POLICY "Authenticated read workout_plans (gated)"
  ON public.workout_plans FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR week_of_release = 0
    OR (
      tier <= public.user_tier_int()
      AND (min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= min_age)
      AND (max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= max_age)
    )
  );

CREATE POLICY "Authenticated read workout_plan_weeks (gated)"
  ON public.workout_plan_weeks FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.workout_plans wp
      WHERE wp.id = workout_plan_weeks.plan_id
        AND (
          wp.week_of_release = 0
          OR (
            wp.tier <= public.user_tier_int()
            AND (wp.min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= wp.min_age)
            AND (wp.max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= wp.max_age)
          )
        )
    )
  );

CREATE POLICY "Authenticated read workout_plan_days (gated)"
  ON public.workout_plan_days FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.workout_plan_weeks ww
      JOIN public.workout_plans wp ON wp.id = ww.plan_id
      WHERE ww.id = workout_plan_days.week_id
        AND (
          wp.week_of_release = 0
          OR (
            wp.tier <= public.user_tier_int()
            AND (wp.min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= wp.min_age)
            AND (wp.max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= wp.max_age)
          )
        )
    )
  );

CREATE POLICY "Authenticated read workout_plan_exercises (gated)"
  ON public.workout_plan_exercises FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.workout_plan_days wd
      JOIN public.workout_plan_weeks ww ON ww.id = wd.week_id
      JOIN public.workout_plans wp ON wp.id = ww.plan_id
      WHERE wd.id = workout_plan_exercises.day_id
        AND (
          wp.week_of_release = 0
          OR (
            wp.tier <= public.user_tier_int()
            AND (wp.min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= wp.min_age)
            AND (wp.max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= wp.max_age)
          )
        )
    )
  );

CREATE POLICY "Authenticated read workout_plan_blocks (gated)"
  ON public.workout_plan_blocks FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.workout_plan_days wd
      JOIN public.workout_plan_weeks ww ON ww.id = wd.week_id
      JOIN public.workout_plans wp ON wp.id = ww.plan_id
      WHERE wd.id = workout_plan_blocks.day_id
        AND (
          wp.week_of_release = 0
          OR (
            wp.tier <= public.user_tier_int()
            AND (wp.min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= wp.min_age)
            AND (wp.max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= wp.max_age)
          )
        )
    )
  );

-- ── meal_plans + descendants ────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated read meal_plans (gated)" ON public.meal_plans;
DROP POLICY IF EXISTS "Authenticated read meal_plan_days (gated)" ON public.meal_plan_days;

CREATE POLICY "Authenticated read meal_plans (gated)"
  ON public.meal_plans FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR week_of_release = 0
    OR (
      tier <= public.user_tier_int()
      AND (min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= min_age)
      AND (max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= max_age)
    )
  );

CREATE POLICY "Authenticated read meal_plan_days (gated)"
  ON public.meal_plan_days FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.meal_plans mp
      WHERE mp.id = meal_plan_days.plan_id
        AND (
          mp.week_of_release = 0
          OR (
            mp.tier <= public.user_tier_int()
            AND (mp.min_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() >= mp.min_age)
            AND (mp.max_age IS NULL OR public.user_age_years() IS NULL OR public.user_age_years() <= mp.max_age)
          )
        )
    )
  );

COMMIT;
