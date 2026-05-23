"use client";

import { Check, ChevronsRight, Flame, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import type { WorkoutPlanBlock, WorkoutPlanExercise } from "../queries";

interface BlockWithExercises extends WorkoutPlanBlock {
  exercises: WorkoutPlanExercise[];
}

/**
 * Interactive workout-day screen. Renders blocks + exercise rows; each
 * row toggles completion in workout_plan_exercise_completions on tap
 * (optimistic). A swipe-to-finish bar at the bottom marks every
 * remaining exercise as complete in one batch upsert and bounces back
 * to /weight-room so the freshly-updated progress card is visible.
 */
export function WorkoutDetailClient({
  blocks,
  orphanExercises,
  initialCompleted,
  returnHref = "/weight-room",
}: {
  blocks: BlockWithExercises[];
  orphanExercises: WorkoutPlanExercise[];
  initialCompleted: string[];
  returnHref?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(initialCompleted)
  );
  const [pending, startTransition] = useTransition();

  const allExercises = useMemo(
    () => [
      ...blocks.flatMap((b) => b.exercises),
      ...orphanExercises,
    ],
    [blocks, orphanExercises]
  );

  const totalCount = allExercises.length;
  const completedCount = allExercises.filter((e) => completed.has(e.id)).length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  function toggle(id: string) {
    const isCurrentlyOn = completed.has(id);
    // Optimistic flip
    setCompleted((prev) => {
      const next = new Set(prev);
      if (isCurrentlyOn) next.delete(id);
      else next.add(id);
      return next;
    });
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in.", variant: "destructive" });
        // revert
        setCompleted((prev) => {
          const next = new Set(prev);
          if (isCurrentlyOn) next.add(id);
          else next.delete(id);
          return next;
        });
        return;
      }
      if (isCurrentlyOn) {
        const { error } = await supabase
          .from("workout_plan_exercise_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("exercise_id", id);
        if (error) {
          toast({
            title: "Couldn't update",
            description: error.message,
            variant: "destructive",
          });
          setCompleted((prev) => new Set(prev).add(id));
        }
      } else {
        const { error } = await supabase
          .from("workout_plan_exercise_completions")
          .upsert(
            { user_id: user.id, exercise_id: id },
            { onConflict: "user_id,exercise_id" }
          );
        if (error) {
          toast({
            title: "Couldn't save",
            description: error.message,
            variant: "destructive",
          });
          setCompleted((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }
      }
    });
  }

  async function completeAll() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in.", variant: "destructive" });
      return;
    }
    const remaining = allExercises
      .filter((e) => !completed.has(e.id))
      .map((e) => ({ user_id: user.id, exercise_id: e.id }));
    setCompleted(new Set(allExercises.map((e) => e.id)));
    if (remaining.length > 0) {
      const { error } = await supabase
        .from("workout_plan_exercise_completions")
        .upsert(remaining, { onConflict: "user_id,exercise_id" });
      if (error) {
        toast({
          title: "Couldn't finish workout",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }
    toast({
      title: "Workout complete",
      description: "Nice work — your progress is updated.",
    });
    // Refresh so /weight-room re-fetches with the new completion rows,
    // then navigate. Order matters: refresh first means push lands on
    // a freshly-rendered tree (no stale Track Your Progress card).
    router.refresh();
    router.push(returnHref);
  }

  return (
    <>
      <div className="space-y-5">
        {blocks.map((block) => {
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
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    done={completed.has(ex.id)}
                    onToggle={() => toggle(ex.id)}
                    disabled={pending}
                  />
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
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  done={completed.has(ex.id)}
                  onToggle={() => toggle(ex.id)}
                  disabled={pending}
                />
              ))}
            </ol>
          </section>
        )}

        {/* spacer so the floating slider doesn't cover the last row */}
        <div className="h-24" />
      </div>

      <SwipeToComplete
        completedCount={completedCount}
        totalCount={totalCount}
        allDone={allDone}
        onComplete={completeAll}
      />
    </>
  );
}

function ExerciseRow({
  exercise,
  done,
  onToggle,
  disabled,
}: {
  exercise: WorkoutPlanExercise;
  done: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const metaParts: string[] = [];
  if (exercise.sets) metaParts.push(`${exercise.sets} sets`);
  if (exercise.reps) metaParts.push(`${exercise.reps} reps`);
  if (exercise.time) metaParts.push(exercise.time);
  if (exercise.weight) metaParts.push(exercise.weight);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex w-full items-start gap-3 py-3.5 text-left active:opacity-80 disabled:opacity-70"
      >
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
            done
              ? "bg-[#10B981] text-white"
              : "border-2 border-border bg-white text-transparent"
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[15px] font-semibold leading-tight",
              done && "text-muted-foreground line-through"
            )}
          >
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
      </button>
    </li>
  );
}

/**
 * Slide-to-complete drawer pinned above the tab bar. The thumb drags
 * left→right; releasing past 80% fires onComplete, anything less snaps
 * back. Pointer events handle both touch and mouse.
 */
function SwipeToComplete({
  completedCount,
  totalCount,
  allDone,
  onComplete,
}: {
  completedCount: number;
  totalCount: number;
  allDone: boolean;
  onComplete: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [dragging, setDragging] = useState(false);
  const [firing, setFiring] = useState(false);

  // Auto-complete state if user manually toggled everything done.
  useEffect(() => {
    if (allDone && !firing) {
      setProgress(1);
    } else if (!dragging && !firing) {
      setProgress(0);
    }
  }, [allDone, dragging, firing]);

  function pointerToProgress(clientX: number): number {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const thumbSize = 56;
    const usable = rect.width - thumbSize;
    if (usable <= 0) return 0;
    const x = clientX - rect.left - thumbSize / 2;
    return Math.max(0, Math.min(1, x / usable));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (firing) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setProgress(pointerToProgress(e.clientX));
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setProgress(pointerToProgress(e.clientX));
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    if (progress >= 0.8) {
      setFiring(true);
      setProgress(1);
      // brief delay so the user sees the bar fully fill
      window.setTimeout(() => onComplete(), 220);
    } else {
      setProgress(0);
    }
  }

  const labelOpacity = Math.max(0, 1 - progress * 1.4);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),0.5rem)] z-40 flex justify-center px-4 md:bottom-4">
      <div className="pointer-events-auto w-full max-w-[640px]">
        <div className="rounded-full bg-white/90 px-2 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.18)] ring-1 ring-black/5 backdrop-blur">
          <div
            ref={trackRef}
            className={cn(
              "relative h-14 overflow-hidden rounded-full transition-colors",
              firing || allDone ? "bg-[#10B981]" : "bg-primary"
            )}
          >
            {/* progress fill */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-[width] ease-out",
                dragging ? "duration-75" : "duration-200",
                firing ? "bg-[#10B981]/85" : "bg-white/15"
              )}
              style={{ width: `${progress * 100}%` }}
            />

            {/* label */}
            <div
              className="absolute inset-0 flex items-center justify-center text-[14px] font-bold uppercase tracking-[0.12em] text-white"
              style={{ opacity: labelOpacity }}
            >
              {totalCount > 0
                ? `Slide to complete · ${completedCount}/${totalCount}`
                : "No exercises"}
            </div>

            {/* thumb */}
            <button
              type="button"
              aria-label="Slide to complete workout"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              disabled={firing || totalCount === 0}
              className={cn(
                "absolute top-1 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform",
                dragging ? "scale-105" : "scale-100",
                firing && "text-[#10B981]"
              )}
              style={{
                left: `calc(0.25rem + ${progress} * (100% - 3.25rem))`,
                touchAction: "none",
              }}
            >
              {firing ? (
                <Check className="h-6 w-6" strokeWidth={3} />
              ) : (
                <ChevronsRight className="h-6 w-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
