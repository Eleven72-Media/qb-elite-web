import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import {
  getRecipesByTitles,
  getUserMealPlan,
} from "@/features/nutrition/queries";
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

export default async function GroceryListPage() {
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

  const mealPlan = await getUserMealPlan(supabase);
  if (!mealPlan) {
    return (
      <>
        <PageHeader title="Grocery List" backHref="/nutrition/meal-plan" />
        <div className="mx-auto w-full max-w-[820px] px-5 pt-10 md:px-6">
          <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            No meal plan published for your week yet — nothing to shop for.
          </div>
        </div>
      </>
    );
  }

  // Collect every meal-text string used across the week, tagged with the
  // day it appears so the source list at the bottom of the page can
  // group by day for the user.
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

  // Match meal text → recipe rows. Anything that doesn't match shows up
  // in the "Couldn't match" section so the athlete still sees it.
  const recipes = await getRecipesByTitles(supabase, distinctMeals);
  const byTitle = new Map(recipes.map((r) => [r.title.toLowerCase(), r]));

  // Dedupe ingredients across the whole week (case-insensitive on first
  // word so "2 eggs" + "1 egg" don't both appear — close enough for a
  // grocery list).
  const ingredientMap = new Map<
    string,
    { display: string; meals: Set<string> }
  >();
  const unmatchedMeals: { meal: string; days: string[] }[] = [];

  for (const m of distinctMeals) {
    const r = byTitle.get(m.toLowerCase());
    const daysWithThis = mentions
      .filter((x) => x.meal === m)
      .map((x) => DAY_LABELS[x.day] ?? x.day);
    if (!r || r.ingredients.length === 0) {
      unmatchedMeals.push({ meal: m, days: Array.from(new Set(daysWithThis)) });
      continue;
    }
    for (const raw of r.ingredients) {
      const key = raw.trim().toLowerCase();
      if (!key) continue;
      const existing = ingredientMap.get(key);
      if (existing) {
        for (const d of daysWithThis) existing.meals.add(`${m} (${d})`);
      } else {
        ingredientMap.set(key, {
          display: raw.trim(),
          meals: new Set(daysWithThis.map((d) => `${m} (${d})`)),
        });
      }
    }
  }

  const items = Array.from(ingredientMap.values())
    .sort((a, b) => a.display.localeCompare(b.display))
    .map((it) => ({
      ingredient: it.display,
      usedFor: Array.from(it.meals).sort(),
    }));

  const weekLabel =
    mealPlan.plan.name ?? `Week ${mealPlan.plan.weekOfRelease} plan`;

  return (
    <>
      <PageHeader title="Grocery List" backHref="/nutrition/meal-plan" />
      <GroceryListClient
        weekLabel={weekLabel}
        items={items}
        unmatched={unmatchedMeals}
      />
    </>
  );
}
