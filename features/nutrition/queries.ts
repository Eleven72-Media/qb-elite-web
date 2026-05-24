import type { SupabaseClient } from "@supabase/supabase-js";

export interface MealPlan {
  id: string;
  name: string | null;
  description: string | null;
  tier: number;
  weekOfRelease: number;
}

export interface MealPlanDay {
  id: string;
  planId: string;
  day: string; // 'monday' .. 'sunday'
  breakfast: string | null;
  snack: string | null;
  proteinShake: string | null;
  mainCourse: string | null;
  side: string | null;
  // Optional FK to a recipes row, set by admin when a meal slot is
  // pinned to a specific recipe. Null → fall back to title matching.
  breakfastRecipeId: string | null;
  snackRecipeId: string | null;
  proteinShakeRecipeId: string | null;
  mainCourseRecipeId: string | null;
  sideRecipeId: string | null;
  sortOrder: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  preparationTime: string | null;
  calories: string | null;
  protein: string | null;
  ingredients: string[];
  instructions: string[];
  meal: string | null;
}

export interface NutritionVideo {
  id: string;
  title: string;
  videoLink: string;
  isIntro: boolean;
}

const mapPlan = (db: any): MealPlan => ({
  id: db.id,
  name: db.name ?? null,
  description: db.description ?? null,
  tier: db.tier ?? 1,
  weekOfRelease: db.week_of_release ?? 1,
});

const mapDay = (db: any): MealPlanDay => ({
  id: db.id,
  planId: db.plan_id,
  day: db.day,
  breakfast: db.breakfast ?? null,
  snack: db.snack ?? null,
  proteinShake: db.protein_shake ?? null,
  mainCourse: db.main_course ?? null,
  side: db.side ?? null,
  breakfastRecipeId: db.breakfast_recipe_id ?? null,
  snackRecipeId: db.snack_recipe_id ?? null,
  proteinShakeRecipeId: db.protein_shake_recipe_id ?? null,
  mainCourseRecipeId: db.main_course_recipe_id ?? null,
  sideRecipeId: db.side_recipe_id ?? null,
  sortOrder: db.sort_order ?? 0,
});

const mapRecipe = (db: any): Recipe => ({
  id: db.id,
  title: db.title ?? "",
  description: db.description ?? null,
  // Flutter/admin write to `image` on recipes (not image_url — that lives on
  // home_slider). Fall back to image_url just in case some rows got the wrong
  // column during dev.
  imageUrl: db.image ?? db.image_url ?? null,
  preparationTime: db.preparation_time ?? null,
  calories: db.calories ?? null,
  protein: db.protein ?? null,
  ingredients: Array.isArray(db.ingredients) ? db.ingredients : [],
  instructions: Array.isArray(db.instructions) ? db.instructions : [],
  meal: db.meal ?? null,
});

export async function getRecipeCategories(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("meal")
    .not("meal", "is", null)
    .limit(500);
  if (error) throw error;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of (data ?? []) as Array<{ meal: string | null }>) {
    const v = (r.meal ?? "").trim();
    if (v && !seen.has(v.toLowerCase())) {
      seen.add(v.toLowerCase());
      out.push(v);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

export async function getRecipe(
  supabase: SupabaseClient,
  id: string
): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRecipe(data) : null;
}

/**
 * Returns a `lowercase-title → recipe-id` map for matching meal-plan
 * day text (which is free-text typed by the admin) to a real recipe row.
 *
 * meal_plan_days stores `breakfast`, `snack`, `main_course`, etc. as
 * strings — there's also a `*_recipe_id` FK when the admin explicitly
 * pins a recipe, but most rows rely on title-match. The previous
 * implementation used Postgres `.in("title", […])`, which is
 * case-sensitive and exact — so "Pancakes" in the day cell didn't
 * match "pancakes" in `recipes.title` (or any extra trailing space).
 *
 * Fetching all recipes once and matching client-side is cheap
 * (typically <200 rows) and gives us a single source of truth that's
 * trivially case- and whitespace-insensitive. When two recipes share
 * the same title (rare but possible), we skip the duplicate so a click
 * never lands on the "wrong" recipe — the admin should disambiguate
 * by setting an explicit `*_recipe_id` FK in that case.
 */
export async function getRecipeIdByTitleMap(
  supabase: SupabaseClient
): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title")
    .limit(1000);
  if (error) {
    console.warn("recipes title-map fetch failed:", error.message);
    return new Map();
  }
  const result = new Map<string, string>();
  const seenDuplicates = new Set<string>();
  for (const row of (data ?? []) as Array<{ id: string; title: string | null }>) {
    const key = (row.title ?? "").trim().toLowerCase();
    if (!key) continue;
    if (result.has(key)) {
      if (!seenDuplicates.has(key)) {
        seenDuplicates.add(key);
        console.warn(
          `recipes: duplicate title "${row.title}" — meal-plan title-match disabled for this title (set *_recipe_id explicitly).`
        );
      }
      result.delete(key); // ambiguous → no auto-link
      continue;
    }
    if (seenDuplicates.has(key)) continue;
    result.set(key, row.id);
  }
  return result;
}

const mapNutritionVideo = (db: any): NutritionVideo => ({
  id: db.id,
  title: db.title ?? "",
  videoLink: db.video_link ?? "",
  isIntro: db.is_intro ?? false,
});

export async function getUserMealPlan(
  supabase: SupabaseClient,
  forWeek?: number
): Promise<{ plan: MealPlan; days: MealPlanDay[] } | null> {
  let query = supabase.from("meal_plans").select("*");
  if (typeof forWeek === "number") {
    query = query.eq("week_of_release", forWeek);
  }
  const { data: plans, error } = await query
    .order("week_of_release", { ascending: false })
    .limit(1);
  if (error) throw error;
  const plan = (plans ?? [])[0];
  if (!plan) return null;
  const { data: days } = await supabase
    .from("meal_plan_days")
    .select("*")
    .eq("plan_id", plan.id)
    .order("sort_order", { ascending: true });
  return { plan: mapPlan(plan), days: (days ?? []).map(mapDay) };
}

/** All meal plans the user can see, used for the week picker. */
export async function getAllMealPlans(
  supabase: SupabaseClient
): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .order("week_of_release", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPlan);
}

/** Cohort week from the SECURITY DEFINER RPC. */
export async function getUserMealPlanWeek(
  supabase: SupabaseClient
): Promise<number> {
  const { data, error } = await supabase.rpc("user_plan_week");
  if (error) {
    console.warn("user_plan_week rpc failed:", error.message);
    return 0;
  }
  return (data as number) ?? 0;
}

export async function getRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("title", { ascending: true })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map(mapRecipe);
}

export async function getNutritionVideos(
  supabase: SupabaseClient
): Promise<NutritionVideo[]> {
  const { data, error } = await supabase
    .from("nutrition_videos")
    .select("*")
    .order("title", { ascending: true })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map(mapNutritionVideo);
}
