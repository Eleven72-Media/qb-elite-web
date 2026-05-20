import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const activePlan = plans[plans.length - 1]; // most recent (highest week)

  if (!activePlan) notFound();

  const days = await getWorkoutPlanDays(supabase, activePlan.id);
  const day = matchDay(date, days);
  if (!day) notFound();

  const [blocks, exercises] = await Promise.all([
    getWorkoutPlanBlocks(supabase, day.id),
    getWorkoutPlanExercises(supabase, day.id),
  ]);

  // Group exercises by block. Exercises with block_id=null go in a
  // synthetic "Main" bucket so they still render.
  const blocksWithExercises = blocks.map((b) => ({
    ...b,
    exercises: exercises
      .filter((e) => e.blockId === b.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
  const orphanExercises = exercises.filter((e) => e.blockId === null);

  return (
    <div className="container max-w-2xl space-y-6 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {longDateLabel(date)}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          {day.label ?? "Today's Workout"}
        </h1>
      </header>

      {blocksWithExercises.map((block) => (
        <section key={block.id} className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-baseline gap-3">
            <span
              className={
                block.label === "burnout"
                  ? "rounded-md bg-destructive/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive"
                  : "rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
              }
            >
              {block.label === "burnout"
                ? "Burnout"
                : `Block ${block.label.toUpperCase()}`}
            </span>
            <span className="text-sm text-muted-foreground">{block.rounds}</span>
          </div>
          <ol className="space-y-3">
            {block.exercises.map((ex) => (
              <ExerciseRow key={ex.id} exercise={ex} />
            ))}
            {block.exercises.length === 0 && (
              <li className="text-sm italic text-muted-foreground">
                No exercises in this block yet.
              </li>
            )}
          </ol>
        </section>
      ))}

      {orphanExercises.length > 0 && (
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Other
          </h2>
          <ol className="space-y-3">
            {orphanExercises.map((ex) => (
              <ExerciseRow key={ex.id} exercise={ex} />
            ))}
          </ol>
        </section>
      )}

      <div className="flex justify-center">
        <Button variant="outline" disabled>
          Mark Day Complete (Sprint 3)
        </Button>
      </div>
    </div>
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
    <li className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
      <div className="flex-1">
        <p className="text-sm font-semibold">{exercise.exerciseName}</p>
        {metaParts.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {metaParts.join(" · ")}
          </p>
        )}
        {exercise.notes && (
          <p className="mt-1 text-xs italic text-muted-foreground">
            {exercise.notes}
          </p>
        )}
      </div>
      {exercise.videoId && (
        <Badge variant="outline" className="text-[10px]">
          Video
        </Badge>
      )}
    </li>
  );
}
