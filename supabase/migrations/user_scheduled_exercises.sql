-- F-006: per-user, per-day scheduled exercises (Starter custom workouts)
--
-- Starter-tier users don't get admin-authored workout plans past Week 1,
-- but they still want to build their own training day from the Training
-- Videos library. This table holds the workouts they've pinned to a
-- specific date plus any sets/reps/weight they set on the scheduling
-- card.
--
-- The Weight Room preview card surfaces these rows when no admin plan
-- day matches the selected date. The workout-detail page renders them
-- as a single "Your Workout" block so Mark Complete / Slide to Finish
-- still work — those flows write to workout_plan_exercise_completions
-- (admin-plan exercise IDs) so user-scheduled completions live in a
-- separate per-row id space and we just toggle by user_scheduled_id.

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_scheduled_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  sets INT,
  reps TEXT,
  weight TEXT,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_scheduled_exercises IS
  'A workout the user has pinned to a specific calendar day from the Training Videos library. Mirrors a per-row "exercise" inside a custom workout day.';

CREATE INDEX IF NOT EXISTS idx_user_scheduled_exercises_user_date
  ON public.user_scheduled_exercises (user_id, scheduled_date);

ALTER TABLE public.user_scheduled_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own scheduled exercises"
  ON public.user_scheduled_exercises;
CREATE POLICY "users read own scheduled exercises"
  ON public.user_scheduled_exercises FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users insert own scheduled exercises"
  ON public.user_scheduled_exercises;
CREATE POLICY "users insert own scheduled exercises"
  ON public.user_scheduled_exercises FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users update own scheduled exercises"
  ON public.user_scheduled_exercises;
CREATE POLICY "users update own scheduled exercises"
  ON public.user_scheduled_exercises FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users delete own scheduled exercises"
  ON public.user_scheduled_exercises;
CREATE POLICY "users delete own scheduled exercises"
  ON public.user_scheduled_exercises FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

COMMIT;
