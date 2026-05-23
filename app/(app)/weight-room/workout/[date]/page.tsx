import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { WorkoutDetailClient } from "@/features/weight-room/components/workout-detail-client";
import {
  getCompletedExerciseIds,
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutPlanBlocks,
  getWorkoutPlanDays,
  getWorkoutPlanExercises,
} from "@/features/weight-room/queries";
import { longDateLabel, matchDay, parseIsoDate } from "@/features/weight-room/week-helpers";
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

  const [plans, planWeek] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
  ]);
  if (plans.length === 0) notFound();

  // CRITICAL: pick the same plan the /weight-room page picks for the
  // same week, otherwise the completed exercises live on a different
  // plan's day rows and the Track Your Progress widget never moves.
  const currentWeek = Math.max(planWeek, 0);
  const requested = searchParams.week
    ? parseInt(searchParams.week.replace(/[^0-9]/g, ""), 10)
    : NaN;
  const explicitWeek =
    !Number.isNaN(requested) && requested <= currentWeek ? requested : null;
  const selectedWeek = explicitWeek ?? currentWeek;
  const activePlan =
    plans
      .filter((p) => p.weekOfRelease === selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    ?? plans
      .filter((p) => p.weekOfRelease <= selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    ?? plans[plans.length - 1];

  const days = await getWorkoutPlanDays(supabase, activePlan.id);
  const day = matchDay(date, days);
  if (!day) notFound();

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

  // The slider routes back to /weight-room — preserve the week + day so
  // the user lands on the same view they came from, with the freshly
  // updated progress card.
  const returnParams = new URLSearchParams();
  returnParams.set("day", params.date);
  if (explicitWeek != null) returnParams.set("week", String(explicitWeek));
  const returnHref = `/weight-room?${returnParams.toString()}`;

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
