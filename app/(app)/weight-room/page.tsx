import { ChevronRight, Dumbbell } from "lucide-react";
import Link from "next/link";

import { PaywallCard } from "@/features/weight-room/components/paywall-card";
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

export default async function WeightRoomPage() {
  const supabase = createClient();
  const [plans, planWeek] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
  ]);

  const activePlan =
    plans
      .filter((p) => p.weekOfRelease <= Math.max(planWeek, 0))
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0] ?? null;

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

  // For the workout card we want a block/exercise count, like Flutter.
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

  return (
    <div className="mx-auto w-full max-w-[820px] pb-4">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <h1 className="text-[18px] font-bold leading-tight tracking-tight">
          Weight Room
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your workout planner and training videos
        </p>
      </header>

      <div className="px-4 md:px-6">
        <WeekStrip initialDates={weekDates} days={days} />
      </div>

      <div className="mt-3 flex items-center gap-2.5 px-5 md:px-6">
        <span className="inline-block h-6 w-1 rounded-full bg-primary" />
        <p className="text-[15px] font-bold text-foreground">{todayLabel}</p>
        <span className="rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
          Today
        </span>
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
