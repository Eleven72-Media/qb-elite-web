import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import {
  getRecipesByTitles,
  getUserMealPlan,
  getUserMealPlanWeek,
} from "@/features/nutrition/queries";
import { aggregateGroceryItems } from "@/features/nutrition/grocery-aggregate";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

import { GroceryListClient } from "./grocery-list-client";

export const metadata = { title: "Grocery List — QB Elite" };
export const dynamic = "force-dynamic";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default async function GroceryListPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/nutrition/meal-plan/grocery-list");

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

  // Default to the user's cohort week; honor ?week= when present (and
  // ≤ cohort, same rule as the meal planner picker). This is the fix
  // for "why is it showing Week 12 when I'm on Week 1?"
  const cohortWeek = await getUserMealPlanWeek(supabase);
  const requested = searchParams.week
    ? parseInt(searchParams.week.replace(/[^0-9]/g, ""), 10)
    : NaN;
  const explicitWeek =
    !Number.isNaN(requested) && requested <= cohortWeek ? requested : null;
  const selectedWeek = explicitWeek ?? Math.max(cohortWeek, 0);

  const mealPlan = await getUserMealPlan(supabase, selectedWeek);
  if (!mealPlan) {
    return (
      <>
        <PageHeader title="Grocery List" backHref={backHrefFor(explicitWeek)} />
        <div className="mx-auto w-full max-w-[820px] px-5 pt-10 md:px-6">
          <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            No meal plan published for Week {selectedWeek} — nothing to shop for.
          </div>
        </div>
      </>
    );
  }

  // Harvest every (meal_text, day) pair from the selected week's plan.
  type Mention = { meal: string; day: string };
  const mentions: Mention[] = [];
  for (const d of mealPlan.days) {
    for (const text of [d.breakfast, d.snack, d.proteinShake, d.mainCourse, d.side]) {
      if (text && text.trim().length > 0) {
        mentions.push({ meal: text.trim(), day: d.day });
      }
    }
  }
  const distinctMeals = Array.from(new Set(mentions.map((m) => m.meal)));

  const recipes = await getRecipesByTitles(supabase, distinctMeals);
  const byTitle = new Map(recipes.map((r) => [r.title.toLowerCase(), r]));

  // Build the raw (ingredient, usedFor) list. Each ingredient line
  // gets paired with "Recipe (Day)" for the attribution row.
  type RawSource = { ingredient: string; usedFor: string };
  const rawSources: RawSource[] = [];
  const unmatchedMeals: { meal: string; days: string[] }[] = [];

  for (const m of distinctMeals) {
    const recipe = byTitle.get(m.toLowerCase());
    const daysWithThis = Array.from(
      new Set(
        mentions.filter((x) => x.meal === m).map((x) => DAY_LABELS[x.day] ?? x.day)
      )
    );
    if (!recipe || recipe.ingredients.length === 0) {
      unmatchedMeals.push({ meal: m, days: daysWithThis });
      continue;
    }
    // Multiply ingredients by the number of distinct days this meal
    // appears in (e.g. eaten Mon + Wed → need 2× ingredients).
    for (const day of daysWithThis) {
      for (const ing of recipe.ingredients) {
        rawSources.push({ ingredient: ing, usedFor: `${m} (${day})` });
      }
    }
  }

  const items = aggregateGroceryItems(rawSources);

  const weekLabel =
    mealPlan.plan.name ?? `Week ${mealPlan.plan.weekOfRelease} plan`;

  return (
    <>
      <PageHeader title="Grocery List" backHref={backHrefFor(explicitWeek)} />
      <GroceryListClient
        weekLabel={weekLabel}
        items={items}
        unmatched={unmatchedMeals}
      />
    </>
  );
}

function backHrefFor(explicitWeek: number | null): string {
  if (explicitWeek == null) return "/nutrition/meal-plan";
  const p = new URLSearchParams();
  p.set("week", String(explicitWeek));
  return `/nutrition/meal-plan?${p.toString()}`;
}
