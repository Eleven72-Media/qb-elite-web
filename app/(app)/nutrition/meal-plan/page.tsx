import { CalendarDays, Coffee, Cookie, Drumstick, ListChecks, Salad, Utensils } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { PlanWeekPicker } from "@/features/weight-room/components/plan-week-picker";
import {
  getAllMealPlans,
  getUserMealPlan,
  getUserMealPlanWeek,
  type MealPlanDay,
} from "@/features/nutrition/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

export const metadata = { title: "Meal Planner — QB Elite" };
export const dynamic = "force-dynamic";

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default async function MealPlanPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/nutrition/meal-plan");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = (profileRow as { subscription_tier: SubscriptionTier } | null)
    ?.subscription_tier;
  if (!tierSatisfies(tier, "starter")) {
    redirect("/paywall");
  }

  const [allPlans, planWeek] = await Promise.all([
    getAllMealPlans(supabase),
    getUserMealPlanWeek(supabase),
  ]);

  const currentWeek = Math.max(planWeek, 0);
  const allWeeks = Array.from(new Set(allPlans.map((p) => p.weekOfRelease))).sort(
    (a, b) => a - b
  );
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

  const mealPlan = await getUserMealPlan(supabase, selectedWeek);

  const header = (
    <PageHeader
      title="Meal Planner"
      backHref="/nutrition"
      action={
        <Link
          href="/nutrition/meal-plan/grocery-list"
          aria-label="Grocery list"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary active:opacity-80"
        >
          <ListChecks className="h-5 w-5" strokeWidth={2} />
        </Link>
      }
    />
  );

  if (!mealPlan) {
    return (
      <>
        {header}
        <div className="mx-auto w-full max-w-[820px] space-y-3 px-5 pt-2 md:px-6">
          {allWeeks.length > 0 && (
            <div className="flex justify-end">
              <PlanWeekPicker
                selectedWeek={selectedWeek}
                currentWeek={currentWeek}
                allWeeks={allWeeks}
                basePath="/nutrition/meal-plan"
              />
            </div>
          )}
          <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            No meal plan published for Week {selectedWeek}. Try another week or
            check back soon.
          </div>
        </div>
      </>
    );
  }

  const orderedDays = [...mealPlan.days].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  return (
    <>
      {header}
      <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-6 md:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/12 to-primary/0 p-5 ring-1 ring-primary/15">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2.25} />
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  {isViewingPast ? `Week ${selectedWeek}` : "This Week"}
                </p>
              </div>
              <h2 className="mt-1 text-[20px] font-bold leading-tight">
                {mealPlan.plan.name ?? `Week ${mealPlan.plan.weekOfRelease} plan`}
              </h2>
              {mealPlan.plan.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {mealPlan.plan.description}
                </p>
              )}
            </div>
            <PlanWeekPicker
              selectedWeek={selectedWeek}
              currentWeek={currentWeek}
              allWeeks={allWeeks}
              basePath="/nutrition/meal-plan"
            />
          </div>
        </section>

        {isViewingPast && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary/10 px-4 py-2.5">
            <p className="text-xs font-semibold text-primary">
              Viewing past week — Week {selectedWeek}
            </p>
            <Link
              href="/nutrition/meal-plan"
              className="text-xs font-bold text-primary underline-offset-2 hover:underline"
            >
              Back to current
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orderedDays.map((d) => (
            <DayCard key={d.id} day={d} />
          ))}
        </div>
      </div>
    </>
  );
}

function DayCard({ day }: { day: MealPlanDay }) {
  const slots: Array<{
    label: string;
    value: string | null;
    icon: React.ReactNode;
  }> = [
    {
      label: "Breakfast",
      value: day.breakfast,
      icon: <Coffee className="h-4 w-4" strokeWidth={1.75} />,
    },
    {
      label: "Snack",
      value: day.snack,
      icon: <Cookie className="h-4 w-4" strokeWidth={1.75} />,
    },
    {
      label: "Protein Shake",
      value: day.proteinShake,
      icon: <Drumstick className="h-4 w-4" strokeWidth={1.75} />,
    },
    {
      label: "Main",
      value: day.mainCourse,
      icon: <Utensils className="h-4 w-4" strokeWidth={1.75} />,
    },
    {
      label: "Side",
      value: day.side,
      icon: <Salad className="h-4 w-4" strokeWidth={1.75} />,
    },
  ];

  const populated = slots.filter((s) => s.value && s.value.trim().length > 0);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="bg-primary/8 px-5 py-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-primary">
          {DAY_LABELS[day.day] ?? day.day}
        </p>
      </div>
      {populated.length === 0 ? (
        <p className="px-5 py-4 text-sm italic text-muted-foreground">
          Rest day — eat clean, no strict plan.
        </p>
      ) : (
        <ul className="divide-y divide-border/40 px-5">
          {populated.map((s) => (
            <li key={s.label} className="flex items-start gap-3 py-3.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[14px] leading-snug">{s.value}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
