import { ChevronRight, Dumbbell } from "lucide-react";
import Link from "next/link";

import { PaywallCard } from "@/features/weight-room/components/paywall-card";
import { WeekStrip } from "@/features/weight-room/components/week-strip";
import {
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutPlanDays,
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

  return (
    <div className="mx-auto w-full max-w-[820px] pb-4">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <h1 className="text-[18px] font-bold leading-tight tracking-tight">
          Weight Room
        </h1>
        {activePlan && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activePlan.name ?? `Week ${activePlan.weekOfRelease} plan`}
          </p>
        )}
      </header>

      <div className="px-4 md:px-6">
        <WeekStrip dates={weekDates} days={days} />
      </div>

      <div className="px-5 pt-5 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {todayLabel}
        </p>
      </div>

      <div className="px-5 pt-2 md:px-6">
        {activePlan ? (
          todayWorkout ? (
            <Link
              href={`/weight-room/workout/${todayIso}`}
              className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:opacity-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Dumbbell className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
                  Today&apos;s session
                </p>
                <p className="mt-0.5 text-[15px] font-semibold leading-tight">
                  {todayWorkout.label ?? "Workout"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
            </Link>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted px-5 py-8 text-center">
              <p className="text-[15px] font-semibold text-foreground">
                Rest day
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Recover. Hydrate. Come back tomorrow.
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
