import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { WorkoutDetailClient } from "@/features/weight-room/components/workout-detail-client";
import {
  getCompletedExerciseIds,
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
}: {
  params: { date: string };
}) {
  const date = parseIsoDate(params.date);
  if (Number.isNaN(date.getTime())) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/weight-room");

  const plans = await getUserWorkoutPlans(supabase);
  const activePlan = plans[plans.length - 1];
  if (!activePlan) notFound();

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

  // Hydrate only completions for exercises that exist on this day so the
  // client component doesn't carry the rest of the user's history.
  const dayExerciseIds = new Set(exercises.map((e) => e.id));
  const initialCompleted = Array.from(completedSet).filter((id) =>
    dayExerciseIds.has(id)
  );

  return (
    <>
      <PageHeader
        title={day.label ?? "Today's Workout"}
        backHref="/weight-room"
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
        />
      </div>
    </>
  );
}
