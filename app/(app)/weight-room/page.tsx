import { PaywallCard } from "@/features/weight-room/components/paywall-card";
import { WeekStrip } from "@/features/weight-room/components/week-strip";
import {
  getUserPlanWeek,
  getUserWorkoutPlans,
  getWorkoutPlanDays,
} from "@/features/weight-room/queries";
import { currentWeekDates, longDateLabel } from "@/features/weight-room/week-helpers";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Weight Room — QB Elite" };
export const dynamic = "force-dynamic";

export default async function WeightRoomPage() {
  const supabase = createClient();
  const [plans, planWeek] = await Promise.all([
    getUserWorkoutPlans(supabase),
    getUserPlanWeek(supabase),
  ]);

  // RLS returns plans the user is entitled to. For users with active
  // subscriptions, that's typically their current week's plan plus any
  // Week 0 preview. Pick the most-recent week the user has "reached"
  // (week_of_release <= planWeek, max wins). Free users with only the
  // Week 0 preview will land on that.
  const activePlan =
    plans
      .filter((p) => p.weekOfRelease <= Math.max(planWeek, 0))
      .sort((a, b) => b.weekOfRelease - a.weekOfRelease)[0] ?? null;

  const days = activePlan
    ? await getWorkoutPlanDays(supabase, activePlan.id)
    : [];

  const weekDates = currentWeekDates();
  const weekLabel = `${longDateLabel(weekDates[0])} – ${longDateLabel(weekDates[6])}`;

  return (
    <div className="container space-y-6 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {weekLabel}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          Weight Room
        </h1>
        {activePlan ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {activePlan.name ?? `Week ${activePlan.weekOfRelease} plan`}
          </p>
        ) : null}
      </header>

      {activePlan ? (
        <WeekStrip dates={weekDates} days={days} />
      ) : (
        <PaywallCard />
      )}
    </div>
  );
}
