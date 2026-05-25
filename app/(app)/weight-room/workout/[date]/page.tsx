import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { WorkoutDetailClient } from "@/features/weight-room/components/workout-detail-client";
import {
  getCompletedExerciseIds,
  getScheduledExercisesForDay,
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutPlanBlocks,
  getWorkoutPlanDays,
  getWorkoutPlanExercises,
  type WorkoutPlanExercise,
} from "@/features/weight-room/queries";
import {
  cohortWeekForDate,
  longDateLabel,
  matchDay,
  parseIsoDate,
} from "@/features/weight-room/week-helpers";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Workout — QB Elite" };
export const dynamic = "force-dynamic";

export default async function WorkoutDetailPage({
  params,
  searchParams,
}: {
  params: { date: string };
  searchParams: { week?: string };
}) {
  const date = parseIsoDate(params.date);
  if (Number.isNaN(date.getTime())) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/weight-room");

  const [plans, planWeek, scheduled] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
    getScheduledExercisesForDay(supabase, user.id, params.date),
  ]);

  const currentWeek = Math.max(planWeek, 0);
  const requested = searchParams.week
    ? parseInt(searchParams.week.replace(/[^0-9]/g, ""), 10)
    : NaN;
  // Accept any non-negative ?week=, including future weeks (B-019 dropped
  // the server-side gate so we can preview them).
  const explicitWeek = !Number.isNaN(requested) ? Math.max(0, requested) : null;
  // Defense in depth: if the caller forgot ?week= (e.g. external deep link,
  // refresh after the schedule button's `?day=` redirect, etc.) compute
  // the cohort week from the URL's date param instead of silently
  // collapsing to currentWeek — otherwise a future date renders the
  // current week's exercises (with their stale completion ticks). Mirrors
  // /weight-room/page.tsx.
  const dateCohortWeek = cohortWeekForDate(date, currentWeek);
  const selectedWeek = explicitWeek ?? dateCohortWeek;
  const isFutureWeek = selectedWeek > currentWeek;

  // Match exactly; for past/current weeks, fall back to the most recent
  // plan ≤ selectedWeek (the "current" plan stays active until a new
  // one is published). For *future* weeks we do NOT fall back —
  // otherwise we'd re-render the current week's exercises with their
  // (irrelevant) completion ticks.
  const exactPlan = plans
    .filter((p) => p.weekOfRelease === selectedWeek)
    .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0];
  const activePlan = isFutureWeek
    ? exactPlan ?? null
    : exactPlan
      ?? plans
        .filter((p) => p.weekOfRelease <= selectedWeek)
        .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
      ?? plans[plans.length - 1]
      ?? null;

  const days = activePlan ? await getWorkoutPlanDays(supabase, activePlan.id) : [];
  const day = activePlan ? matchDay(date, days) : null;

  // No admin workout for this date AND no user-scheduled exercises →
  // nothing to show. Bounce 404.
  if (!day && scheduled.length === 0) notFound();

  const returnParams = new URLSearchParams();
  returnParams.set("day", params.date);
  // Preserve the cohort week the user came from so the back arrow
  // restores their context (week strip stays anchored on that week).
  returnParams.set("week", String(selectedWeek));
  const returnHref = `/weight-room?${returnParams.toString()}`;

  // ── Branch A: admin-authored workout day ────────────────────────────
  if (day && activePlan) {
    const [blocks, exercises, completedSet] = await Promise.all([
      getWorkoutPlanBlocks(supabase, day.id),
      getWorkoutPlanExercises(supabase, day.id),
      getCompletedExerciseIds(supabase, user.id),
    ]);

    const blocksWithExercises = blocks.map((b) => ({
      ...b,
      exercises: exercises
        .filter((e) => e.blockId === b.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
    const orphanExercises = exercises.filter((e) => e.blockId === null);

    const dayExerciseIds = new Set(exercises.map((e) => e.id));
    const initialCompleted = Array.from(completedSet).filter((id) =>
      dayExerciseIds.has(id)
    );

    return (
      <>
        <PageHeader
          title={day.label ?? "Today's Workout"}
          backHref={returnHref}
        />
        <div className="mx-auto w-full max-w-[820px] px-5 pb-6 md:px-6">
          <div className="mb-5 rounded-2xl bg-muted px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
              {longDateLabel(date)}
            </p>
            <p className="mt-0.5 text-sm text-foreground/80">
              {activePlan.name ?? `Week ${activePlan.weekOfRelease} plan`}
            </p>
          </div>
          <WorkoutDetailClient
            blocks={blocksWithExercises}
            orphanExercises={orphanExercises}
            initialCompleted={initialCompleted}
            returnHref={returnHref}
          />
        </div>
      </>
    );
  }

  // ── Branch B: user-scheduled custom workout day ─────────────────────
  // Synthesize an "Other" pseudo-block from the scheduled rows so the
  // existing WorkoutDetailClient can render + complete them without
  // any UI changes. Each scheduled row maps to one exercise; we reuse
  // the row id as both the exercise id and the completion key so
  // toggling completion writes to user_scheduled_exercises.completed_at
  // via the dedicated client variant below.
  const synthesizedExercises: WorkoutPlanExercise[] = scheduled.map((s) => ({
    id: s.id,
    dayId: "__scheduled__",
    blockId: null,
    videoId: s.workoutId,
    exerciseName: s.exerciseName,
    sets: s.sets,
    reps: s.reps,
    weight: s.weight,
    time: null,
    notes: s.notes,
    sortOrder: s.sortOrder,
  }));
  const initialCompleted = scheduled
    .filter((s) => s.completedAt != null)
    .map((s) => s.id);

  return (
    <>
      <PageHeader title="Your Workout" backHref={returnHref} />
      <div className="mx-auto w-full max-w-[820px] px-5 pb-6 md:px-6">
        <div className="mb-5 rounded-2xl bg-muted px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
            {longDateLabel(date)}
          </p>
          <p className="mt-0.5 text-sm text-foreground/80">
            Custom workout · {scheduled.length} exercise
            {scheduled.length === 1 ? "" : "s"}
          </p>
        </div>
        <WorkoutDetailClient
          blocks={[]}
          orphanExercises={synthesizedExercises}
          initialCompleted={initialCompleted}
          returnHref={returnHref}
          mode="scheduled"
        />
      </div>
    </>
  );
}
