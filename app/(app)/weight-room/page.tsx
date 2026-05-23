import { ChevronRight, Dumbbell, PlayCircle } from "lucide-react";
import Link from "next/link";

import { PaywallCard } from "@/features/weight-room/components/paywall-card";
import { PlanWeekPicker } from "@/features/weight-room/components/plan-week-picker";
import { CategoryPicker } from "@/features/weight-room/components/category-picker";
import { WeekStrip } from "@/features/weight-room/components/week-strip";
import { WeeklyProgress } from "@/features/weight-room/components/weekly-progress";
import {
  getCompletedExerciseIds,
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutCategories,
  getWorkoutPlanBlocks,
  getWorkoutPlanDays,
  getWorkoutPlanExercisesForDays,
  getWorkoutsByCategory,
  type Workout,
  type WorkoutPlanExercise,
} from "@/features/weight-room/queries";
import {
  currentWeekDates,
  isoDate,
  matchDay,
  parseIsoDate,
} from "@/features/weight-room/week-helpers";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Weight Room — QB Elite" };
export const dynamic = "force-dynamic";

export default async function WeightRoomPage({
  searchParams,
}: {
  searchParams: { week?: string; day?: string };
}) {
  const supabase = createClient();
  const [plans, planWeek, categories] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
    getWorkoutCategories(supabase),
  ]);

  const currentWeek = Math.max(planWeek, 0);
  const allWeeks = Array.from(
    new Set(plans.map((p) => p.weekOfRelease))
  ).sort((a, b) => a - b);
  if (!allWeeks.includes(currentWeek)) {
    allWeeks.push(currentWeek);
    allWeeks.sort((a, b) => a - b);
  }

  const requested = searchParams.week
    ? parseInt(searchParams.week.replace(/[^0-9]/g, ""), 10)
    : NaN;
  const explicitWeek =
    !Number.isNaN(requested) && requested <= currentWeek ? requested : null;
  const selectedWeek = explicitWeek ?? currentWeek;
  const isViewingPast = explicitWeek !== null && explicitWeek !== currentWeek;

  // Day selection: defaults to today; can be overridden with ?day=YYYY-MM-DD.
  const today = new Date();
  const requestedDay = searchParams.day
    ? parseIsoDate(searchParams.day)
    : today;
  const selectedDate = Number.isNaN(requestedDay.getTime())
    ? today
    : requestedDay;
  const selectedIso = isoDate(selectedDate);
  const selectedLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const isSelectedToday = selectedIso === isoDate(today);

  const activePlan =
    plans
      .filter((p) => p.weekOfRelease === selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    ?? plans
      .filter((p) => p.weekOfRelease <= selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    ?? null;

  const days = activePlan ? await getWorkoutPlanDays(supabase, activePlan.id) : [];
  const selectedDayWorkout = matchDay(selectedDate, days);

  // For the Weekly Progress widget, harvest all exercises across the
  // active plan's days in one shot + read the caller's completion set.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [allExercises, completedExerciseIds] = await Promise.all([
    days.length > 0
      ? getWorkoutPlanExercisesForDays(supabase, days.map((d) => d.id))
      : Promise.resolve([] as WorkoutPlanExercise[]),
    user ? getCompletedExerciseIds(supabase, user.id) : Promise.resolve(new Set<string>()),
  ]);
  const exercisesByDay = allExercises.reduce<
    Record<string, WorkoutPlanExercise[]>
  >((acc, ex) => {
    (acc[ex.dayId] ??= []).push(ex);
    return acc;
  }, {});

  // Block + exercise count for the selected day's preview card.
  let blockCount = 0;
  let exerciseCount = 0;
  let previewExerciseNames: string[] = [];
  if (selectedDayWorkout) {
    const blocks = await getWorkoutPlanBlocks(supabase, selectedDayWorkout.id);
    const exercises = exercisesByDay[selectedDayWorkout.id] ?? [];
    blockCount = blocks.length;
    exerciseCount = exercises.length;
    previewExerciseNames = exercises
      .slice(0, 3)
      .map((e) => e.exerciseName);
  }

  const subtitleParts: string[] = [];
  if (blockCount > 0)
    subtitleParts.push(`${blockCount} block${blockCount === 1 ? "" : "s"}`);
  if (exerciseCount > 0)
    subtitleParts.push(
      `${exerciseCount} exercise${exerciseCount === 1 ? "" : "s"}`
    );

  // Training videos: load workouts for ALL categories up front so chip
  // switching is instant (no per-tap round-trip).
  const workoutsByCategory: Record<string, Workout[]> = {};
  if (categories.length > 0) {
    const results = await Promise.all(
      categories.map((c) => getWorkoutsByCategory(supabase, c.id))
    );
    categories.forEach((c, i) => {
      workoutsByCategory[c.id] = results[i] ?? [];
    });
  }

  const weekDates = currentWeekDates();

  return (
    <div className="mx-auto w-full max-w-[820px] pb-6">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-[18px] font-bold leading-tight tracking-tight">
              Weight Room
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your workout planner and training videos
            </p>
          </div>
          {plans.length > 0 && (
            <PlanWeekPicker
              selectedWeek={selectedWeek}
              currentWeek={currentWeek}
              allWeeks={allWeeks}
              basePath="/weight-room"
            />
          )}
        </div>
      </header>

      {isViewingPast && (
        <div className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-2xl bg-primary/10 px-4 py-2.5 md:mx-6">
          <p className="text-xs font-semibold text-primary">
            Viewing past week — Week {selectedWeek}
          </p>
          <Link
            href="/weight-room"
            className="text-xs font-bold text-primary underline-offset-2 hover:underline"
          >
            Back to current
          </Link>
        </div>
      )}

      <div className="px-4 md:px-6">
        <WeekStrip
          initialDates={weekDates}
          days={days}
          selectedIso={selectedIso}
          weekParam={explicitWeek != null ? String(explicitWeek) : null}
        />
      </div>

      <div className="mt-3 flex items-center gap-2.5 px-5 md:px-6">
        <span className="inline-block h-6 w-1 rounded-full bg-primary" />
        <p className="text-[15px] font-bold text-foreground">{selectedLabel}</p>
        {isSelectedToday && (
          <span className="rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
            Today
          </span>
        )}
      </div>

      <div className="px-4 pt-2 md:px-6">
        {activePlan ? (
          selectedDayWorkout ? (
            <Link
              href={(() => {
                const p = new URLSearchParams();
                if (explicitWeek != null) p.set("week", String(explicitWeek));
                const qs = p.toString();
                return `/weight-room/workout/${selectedIso}${qs ? `?${qs}` : ""}`;
              })()}
              className="block rounded-3xl border border-[#E8E6E3] bg-white p-4 active:opacity-95"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-primary/22 to-primary/6 text-primary">
                  <Dumbbell className="h-[22px] w-[22px]" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[15px] font-bold leading-tight">
                    {selectedDayWorkout.label ?? "Workout"}
                  </p>
                  {subtitleParts.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {subtitleParts.join(" · ")}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className="h-[14px] w-[14px] text-muted-foreground"
                  strokeWidth={2.5}
                />
              </div>
              {previewExerciseNames.length > 0 && (
                <ul className="mt-3.5 space-y-1.5 border-t border-border/40 pt-3">
                  {previewExerciseNames.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-2 text-[13px] text-foreground/80"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="line-clamp-1">{name}</span>
                    </li>
                  ))}
                  {exerciseCount > previewExerciseNames.length && (
                    <li className="text-[12px] text-muted-foreground">
                      +{exerciseCount - previewExerciseNames.length} more
                    </li>
                  )}
                </ul>
              )}
            </Link>
          ) : (
            <div className="rounded-3xl border border-[#E8E6E3] bg-white px-5 py-6 text-center">
              <div className="mx-auto mb-2 flex h-[26px] w-[26px] items-center justify-center text-muted-foreground">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <p className="text-[15px] font-bold">Rest Day</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No workout scheduled for this day
              </p>
            </div>
          )
        ) : (
          <PaywallCard />
        )}
      </div>

      {days.length > 0 && (
        <div className="px-4 pt-5 md:px-6">
          <WeeklyProgress
            days={days}
            exercisesByDay={exercisesByDay}
            completedExerciseIds={completedExerciseIds}
          />
        </div>
      )}

      {categories.length > 0 && (
        <section className="pt-7">
          <div className="px-5 pb-3 md:px-6">
            <div className="flex items-center gap-2">
              <PlayCircle
                className="h-[18px] w-[18px] text-primary"
                strokeWidth={1.75}
              />
              <h2 className="text-[18px] font-bold tracking-tight">
                Training Videos
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Browse by category
            </p>
          </div>
          <CategoryPicker
            categories={categories}
            workoutsByCategory={workoutsByCategory}
          />
        </section>
      )}
    </div>
  );
}
