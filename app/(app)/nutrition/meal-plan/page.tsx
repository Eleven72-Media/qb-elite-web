import { CalendarDays, Coffee, Cookie, Drumstick, ListChecks, Salad, Utensils } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { getUserMealPlan, type MealPlanDay } from "@/features/nutrition/queries";
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

export default async function MealPlanPage() {
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

  const mealPlan = await getUserMealPlan(supabase);

  if (!mealPlan) {
    return (
      <>
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
        <div className="mx-auto w-full max-w-[820px] px-5 pt-10 md:px-6">
          <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            No meal plan published for your week yet. Check back soon — the
            coach drops a fresh week regularly.
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
      <PageHeader title="Meal Planner" backHref="/nutrition" />
      <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-6 md:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/12 to-primary/0 p-5 ring-1 ring-primary/15">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2.25} />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              This Week
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
        </section>

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
