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

  // Admin-authored blocks/exercises (when this day has a plan day).
  let adminBlocks: Array<
    Awaited<ReturnType<typeof getWorkoutPlanBlocks>>[number] & {
      exercises: WorkoutPlanExercise[];
    }
  > = [];
  let adminOrphanExercises: WorkoutPlanExercise[] = [];
  let adminInitialCompleted: string[] = [];
  if (day && activePlan) {
    const [blocks, exercises, completedSet] = await Promise.all([
      getWorkoutPlanBlocks(supabase, day.id),
      getWorkoutPlanExercises(supabase, day.id),
      getCompletedExerciseIds(supabase, user.id),
    ]);
    adminBlocks = blocks.map((b) => ({
      ...b,
      exercises: exercises
        .filter((e) => e.blockId === b.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
    adminOrphanExercises = exercises.filter((e) => e.blockId === null);
    const dayExerciseIds = new Set(exercises.map((e) => e.id));
    adminInitialCompleted = Array.from(completedSet).filter((id) =>
      dayExerciseIds.has(id)
    );
  }

  // User-scheduled exercises (always synthesized when present so they
  // render alongside an admin workout — previously they only showed when
  // there was no admin day, which made the "+" button look broken on
  // days that admin had also authored).
  const scheduledSynthesized: WorkoutPlanExercise[] = scheduled.map((s) => ({
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
  const scheduledInitialCompleted = scheduled
    .filter((s) => s.completedAt != null)
    .map((s) => s.id);

  const hasAdmin = day != null && activePlan != null;
  const hasScheduled = scheduledSynthesized.length > 0;

  const headerTitle = hasAdmin
    ? (day!.label ?? "Today's Workout")
    : "Your Workout";
  const subtitleText = hasAdmin
    ? (activePlan!.name ?? `Week ${activePlan!.weekOfRelease} plan`)
    : `Custom workout · ${scheduled.length} exercise${scheduled.length === 1 ? "" : "s"}`;

  return (
    <>
      <PageHeader title={headerTitle} backHref={returnHref} />
      <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-6 md:px-6">
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
            {longDateLabel(date)}
          </p>
          <p className="mt-0.5 text-sm text-foreground/80">{subtitleText}</p>
        </div>

        {hasAdmin && (
          <WorkoutDetailClient
            blocks={adminBlocks}
            orphanExercises={adminOrphanExercises}
            initialCompleted={adminInitialCompleted}
            returnHref={returnHref}
          />
        )}

        {hasScheduled && (
          <section>
            {hasAdmin && (
              <h2 className="mb-3 mt-1 text-[15px] font-bold tracking-tight text-foreground">
                Your additions
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  ({scheduledSynthesized.length})
                </span>
              </h2>
            )}
            <WorkoutDetailClient
              blocks={[]}
              orphanExercises={scheduledSynthesized}
              initialCompleted={scheduledInitialCompleted}
              returnHref={returnHref}
              mode="scheduled"
            />
          </section>
        )}
      </div>
    </>
  );
}

