import { Flame, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import {
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
  const plans = await getUserWorkoutPlans(supabase);
  const activePlan = plans[plans.length - 1];

  if (!activePlan) notFound();

  const days = await getWorkoutPlanDays(supabase, activePlan.id);
  const day = matchDay(date, days);
  if (!day) notFound();

  const [blocks, exercises] = await Promise.all([
    getWorkoutPlanBlocks(supabase, day.id),
    getWorkoutPlanExercises(supabase, day.id),
  ]);

  const blocksWithExercises = blocks.map((b) => ({
    ...b,
    exercises: exercises
      .filter((e) => e.blockId === b.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
  const orphanExercises = exercises.filter((e) => e.blockId === null);

  return (
    <>
      <PageHeader
        title={day.label ?? "Today's Workout"}
        backHref="/weight-room"
      />
      <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-6 md:px-6">
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
            {longDateLabel(date)}
          </p>
          <p className="mt-0.5 text-sm text-foreground/80">
            {activePlan.name ?? `Week ${activePlan.weekOfRelease} plan`}
          </p>
        </div>

        {blocksWithExercises.map((block) => {
          const isBurnout = block.label?.toLowerCase() === "burnout";
          return (
            <section
              key={block.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
            >
              <div
                className={`flex items-center gap-2 px-5 py-3 ${
                  isBurnout ? "bg-destructive/10" : "bg-primary/8"
                }`}
              >
                {isBurnout ? (
                  <Flame className="h-4 w-4 text-destructive" strokeWidth={2.25} />
                ) : null}
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
                    isBurnout ? "text-destructive" : "text-primary"
                  }`}
                >
                  {isBurnout ? "Burnout" : `Block ${block.label.toUpperCase()}`}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {block.rounds}
                </span>
              </div>
              <ol className="divide-y divide-border/40 px-5">
                {block.exercises.map((ex) => (
                  <ExerciseRow key={ex.id} exercise={ex} />
                ))}
                {block.exercises.length === 0 && (
                  <li className="py-4 text-sm italic text-muted-foreground">
                    No exercises in this block yet.
                  </li>
                )}
              </ol>
            </section>
          );
        })}

        {orphanExercises.length > 0 && (
          <section className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="bg-muted/60 px-5 py-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Other
              </span>
            </div>
            <ol className="divide-y divide-border/40 px-5">
              {orphanExercises.map((ex) => (
                <ExerciseRow key={ex.id} exercise={ex} />
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
}

function ExerciseRow({
  exercise,
}: {
  exercise: import("@/features/weight-room/queries").WorkoutPlanExercise;
}) {
  const metaParts: string[] = [];
  if (exercise.sets) metaParts.push(`${exercise.sets} sets`);
  if (exercise.reps) metaParts.push(`${exercise.reps} reps`);
  if (exercise.time) metaParts.push(exercise.time);
  if (exercise.weight) metaParts.push(exercise.weight);

  return (
    <li className="flex items-start gap-3 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-tight">
          {exercise.exerciseName}
        </p>
        {metaParts.length > 0 && (
          <p className="mt-1 text-[12px] text-muted-foreground">
            {metaParts.join(" · ")}
          </p>
        )}
        {exercise.notes && (
          <p className="mt-1 text-[12px] italic text-muted-foreground">
            {exercise.notes}
          </p>
        )}
      </div>
      {exercise.videoId && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PlayCircle className="h-5 w-5" strokeWidth={1.75} />
        </span>
      )}
    </li>
  );
}
