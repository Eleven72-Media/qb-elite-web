-- Diagnostic queries for the "Legend users not seeing weekly plans" report.
-- Run these read-only queries in the Supabase SQL editor.

-- 1) Count affected users: paid subscribers with NULL tier_upgraded_at.
--    These users will get user_plan_week() = 0 and therefore only see
--    week_of_release=0 plans (the free preview).
SELECT
  subscription_tier,
  subscription_source,
  COUNT(*) AS affected_count
FROM public.profiles
WHERE subscription_tier IN ('starter', 'legend', 'goat')
  AND tier_upgraded_at IS NULL
GROUP BY subscription_tier, subscription_source
ORDER BY subscription_tier, subscription_source;

-- 2) Sanity check the helper for a SPECIFIC user (paste their UUID).
--    Replace '<USER_UUID>' with the affected athlete's auth.users.id.
-- SELECT
--   p.email,
--   p.subscription_tier,
--   p.subscription_source,
--   p.tier_upgraded_at,
--   p.qb_training_started_at,
--   p.birth_date,
--   public.user_tier_int(p.id)        AS tier_int,
--   public.user_plan_week(p.id)       AS plan_week,
--   public.user_qb_training_week(p.id) AS qb_week,
--   public.user_age_years(p.id)       AS age_years
-- FROM public.profiles p
-- WHERE p.id = '<USER_UUID>';

-- 3) Count plans the user would see under current gating.
--    (Run as the affected user, OR sub their UUID into the predicates.)
-- WITH u AS (SELECT '<USER_UUID>'::UUID AS id)
-- SELECT
--   'workout_plans' AS table_name,
--   COUNT(*) FILTER (WHERE week_of_release = 0) AS week0_visible,
--   COUNT(*) FILTER (
--     WHERE tier <= public.user_tier_int((SELECT id FROM u))
--       AND week_of_release > 0
--       AND week_of_release <= public.user_plan_week((SELECT id FROM u))
--   ) AS weekly_visible,
--   COUNT(*) AS total
-- FROM public.workout_plans
-- UNION ALL
-- SELECT
--   'meal_plans',
--   COUNT(*) FILTER (WHERE week_of_release = 0),
--   COUNT(*) FILTER (
--     WHERE tier <= public.user_tier_int((SELECT id FROM u))
--       AND week_of_release > 0
--       AND week_of_release <= public.user_plan_week((SELECT id FROM u))
--   ),
--   COUNT(*)
-- FROM public.meal_plans;

-- 4) Inventory: what tiers + weeks of release exist?
SELECT
  'workout_plans' AS table_name,
  tier,
  week_of_release,
  COUNT(*) AS plans
FROM public.workout_plans
GROUP BY tier, week_of_release
UNION ALL
SELECT
  'meal_plans',
  tier,
  week_of_release,
  COUNT(*)
FROM public.meal_plans
GROUP BY tier, week_of_release
ORDER BY table_name, tier, week_of_release;
