import { ChevronRight, Flame, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getNutritionVideos,
  getRecipes,
  getUserMealPlan,
  type MealPlanDay,
  type Recipe,
} from "@/features/nutrition/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nutrition — QB Elite" };
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

export default async function NutritionPage() {
  const supabase = createClient();
  const [mealPlan, recipes, videos] = await Promise.all([
    getUserMealPlan(supabase),
    getRecipes(supabase),
    getNutritionVideos(supabase),
  ]);

  return (
    <div className="mx-auto w-full max-w-[820px] pb-2">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <h1 className="text-[18px] font-bold leading-tight tracking-tight">
          Nutrition
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Eat to perform — meal plans and recipes
        </p>
      </header>

      <div className="px-5 md:px-6">
        {mealPlan ? (
          <ThisWeekMeals
            name={mealPlan.plan.name ?? `Week ${mealPlan.plan.weekOfRelease} plan`}
            days={mealPlan.days}
          />
        ) : (
          <PaywallCard />
        )}
      </div>

      <section className="px-5 pt-7 md:px-6">
        <div className="mb-3.5 flex items-center gap-2">
          <h2 className="text-[18px] font-bold tracking-tight">Recipes</h2>
        </div>
        {recipes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
            No recipes available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </section>

      {videos.length > 0 && (
        <section className="px-5 pt-7 md:px-6">
          <div className="mb-3.5 flex items-center gap-2">
            <h2 className="text-[18px] font-bold tracking-tight">
              Nutrition Videos
            </h2>
          </div>
          <div className="space-y-3">
            {videos.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Utensils className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="flex-1 text-[15px] font-semibold leading-tight">
                  {v.title}
                </p>
                <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ThisWeekMeals({
  name,
  days,
}: {
  name: string;
  days: MealPlanDay[];
}) {
  return (
    <section className="rounded-3xl border border-border/60 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          This Week
        </span>
        <h2 className="text-[16px] font-bold tracking-tight">{name}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-border/60 bg-muted/40 p-3"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
              {DAY_LABELS[d.day] ?? d.day}
            </p>
            <ul className="mt-2 space-y-1 text-[13px] leading-snug text-foreground/85">
              {d.breakfast && (
                <li>
                  <span className="font-semibold text-foreground">B:</span> {d.breakfast}
                </li>
              )}
              {d.snack && (
                <li>
                  <span className="font-semibold text-foreground">S:</span> {d.snack}
                </li>
              )}
              {d.proteinShake && (
                <li>
                  <span className="font-semibold text-foreground">P:</span> {d.proteinShake}
                </li>
              )}
              {d.mainCourse && (
                <li>
                  <span className="font-semibold text-foreground">M:</span> {d.mainCourse}
                </li>
              )}
              {d.side && (
                <li>
                  <span className="font-semibold text-foreground">Side:</span> {d.side}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/nutrition/recipe/${recipe.id}`} className="block active:opacity-95">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="relative aspect-square w-full bg-muted">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 240px, 45vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Utensils className="h-8 w-8" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3 pb-3.5">
          <p className="line-clamp-2 text-[14px] font-bold leading-tight">
            {recipe.title}
          </p>
          {(recipe.calories || recipe.protein) && (
            <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3 w-3" strokeWidth={2} />
              {[recipe.calories, recipe.protein].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function PaywallCard() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-primary/12 to-primary/0 p-6 text-center ring-1 ring-primary/15">
      <h2 className="mb-2 text-xl font-extrabold uppercase tracking-tight">
        Unlock your meal plan
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Weekly meal plans built for QBs — breakfast, snack, protein shake,
        main + side. Free during your 7-day trial.
      </p>
      <Link href="/paywall">
        <Button size="lg" className="rounded-full px-7">
          Start Free Trial
        </Button>
      </Link>
    </section>
  );
}
