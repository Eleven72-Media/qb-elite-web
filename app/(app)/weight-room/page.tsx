import { ChevronRight, Dumbbell } from "lucide-react";
import Link from "next/link";

import { PaywallCard } from "@/features/weight-room/components/paywall-card";
import { PlanWeekPicker } from "@/features/weight-room/components/plan-week-picker";
import { WeekStrip } from "@/features/weight-room/components/week-strip";
import {
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutPlanBlocks,
  getWorkoutPlanDays,
  getWorkoutPlanExercises,
} from "@/features/weight-room/queries";
import {
  currentWeekDates,
  isoDate,
  matchDay,
} from "@/features/weight-room/week-helpers";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Weight Room — QB Elite" };
export const dynamic = "force-dynamic";

export default async function WeightRoomPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const supabase = createClient();
  const [plans, planWeek] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
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

  // Pick the plan matching the selected week. Ties: prefer the user's
  // tier-matching plan (multiple plans may exist for different age bands).
  const activePlan =
    plans
      .filter((p) => p.weekOfRelease === selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    // fall back to the latest plan ≤ selectedWeek if no exact match
    ?? plans
      .filter((p) => p.weekOfRelease <= selectedWeek)
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0]
    ?? null;

  const days = activePlan ? await getWorkoutPlanDays(supabase, activePlan.id) : [];

  const weekDates = currentWeekDates();
  const today = new Date();
  const todayWorkout = matchDay(today, days);
  const todayIso = isoDate(today);
  const todayLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  let blockCount = 0;
  let exerciseCount = 0;
  if (todayWorkout) {
    const [blocks, exercises] = await Promise.all([
      getWorkoutPlanBlocks(supabase, todayWorkout.id),
      getWorkoutPlanExercises(supabase, todayWorkout.id),
    ]);
    blockCount = blocks.length;
    exerciseCount = exercises.length;
  }

  const subtitleParts: string[] = [];
  if (blockCount > 0)
    subtitleParts.push(`${blockCount} block${blockCount === 1 ? "" : "s"}`);
  if (exerciseCount > 0)
    subtitleParts.push(
      `${exerciseCount} exercise${exerciseCount === 1 ? "" : "s"}`
    );

  const isViewingPast = explicitWeek !== null && explicitWeek !== currentWeek;

  return (
    <div className="mx-auto w-full max-w-[820px] pb-4">
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
        <WeekStrip initialDates={weekDates} days={days} />
      </div>

      <div className="mt-3 flex items-center gap-2.5 px-5 md:px-6">
        <span className="inline-block h-6 w-1 rounded-full bg-primary" />
        <p className="text-[15px] font-bold text-foreground">{todayLabel}</p>
        {!isViewingPast && (
          <span className="rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
            Today
          </span>
        )}
      </div>

      <div className="px-4 pt-2 md:px-6">
        {activePlan ? (
          todayWorkout ? (
            <Link
              href={`/weight-room/workout/${todayIso}`}
              className="flex items-center gap-3.5 rounded-3xl border border-[#E8E6E3] bg-white p-3.5 active:opacity-95"
            >
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-primary/22 to-primary/6 text-primary">
                <Dumbbell className="h-[22px] w-[22px]" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[15px] font-bold leading-tight">
                  {todayWorkout.label ?? "Workout"}
                </p>
                {subtitleParts.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {subtitleParts.join(" · ")}
                  </p>
                )}
              </div>
              <ChevronRight className="h-[14px] w-[14px] text-muted-foreground" strokeWidth={2.5} />
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
    </div>
  );
}
