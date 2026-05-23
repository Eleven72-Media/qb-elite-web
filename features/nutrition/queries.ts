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
  sortOrder: db.sort_order ?? 0,
});

const mapRecipe = (db: any): Recipe => ({
  id: db.id,
  title: db.title ?? "",
  description: db.description ?? null,
  imageUrl: db.image_url ?? null,
  preparationTime: db.preparation_time ?? null,
  calories: db.calories ?? null,
  protein: db.protein ?? null,
  ingredients: Array.isArray(db.ingredients) ? db.ingredients : [],
  instructions: Array.isArray(db.instructions) ? db.instructions : [],
  meal: db.meal ?? null,
});

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

const mapNutritionVideo = (db: any): NutritionVideo => ({
  id: db.id,
  title: db.title ?? "",
  videoLink: db.video_link ?? "",
  isIntro: db.is_intro ?? false,
});

export async function getUserMealPlan(
  supabase: SupabaseClient
): Promise<{ plan: MealPlan; days: MealPlanDay[] } | null> {
  const { data: plans, error } = await supabase
    .from("meal_plans")
    .select("*")
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
