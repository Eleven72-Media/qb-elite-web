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
    <div className="container space-y-8 py-6">
      <header>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">
          Nutrition
        </h1>
      </header>

      {mealPlan ? (
        <ThisWeekMeals
          name={mealPlan.plan.name ?? `Week ${mealPlan.plan.weekOfRelease}`}
          days={mealPlan.days}
        />
      ) : (
        <PaywallCard />
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold uppercase tracking-tight">
          Recipes
        </h2>
        {recipes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recipes available yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </section>

      {videos.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold uppercase tracking-tight">
            Nutrition Videos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((v) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-xl border bg-card p-4 shadow-sm"
              >
                <p className="text-sm font-semibold">{v.title}</p>
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
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-baseline gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          This Week
        </p>
        <h2 className="text-lg font-bold uppercase tracking-tight">{name}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((d) => (
          <div key={d.id} className="rounded-lg border bg-background p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {DAY_LABELS[d.day] ?? d.day}
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              {d.breakfast && (
                <li>
                  <span className="font-semibold">B:</span> {d.breakfast}
                </li>
              )}
              {d.snack && (
                <li>
                  <span className="font-semibold">S:</span> {d.snack}
                </li>
              )}
              {d.proteinShake && (
                <li>
                  <span className="font-semibold">P:</span> {d.proteinShake}
                </li>
              )}
              {d.mainCourse && (
                <li>
                  <span className="font-semibold">M:</span> {d.mainCourse}
                </li>
              )}
              {d.side && (
                <li>
                  <span className="font-semibold">Side:</span> {d.side}
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
    <Link href={`/nutrition/recipe/${recipe.id}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full bg-foreground/5">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 640px) 33vw, 100vw"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="text-sm font-semibold leading-tight">{recipe.title}</p>
          {(recipe.calories || recipe.protein) && (
            <p className="mt-auto text-xs text-muted-foreground">
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
    <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/0 p-6 text-center">
      <h2 className="mb-2 text-xl font-extrabold uppercase tracking-tight">
        Unlock your meal plan
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Weekly meal plans built for QBs — breakfast, snack, protein shake,
        main + side. Free during your 7-day trial.
      </p>
      <Link href="/paywall">
        <Button size="lg">Start Free Trial</Button>
      </Link>
    </section>
  );
}
