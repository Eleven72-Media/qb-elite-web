import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Weight Room data layer.
 *
 * RLS already filters workout_plans by the user's tier, age, and
 * user_plan_week() — so any select that comes back is content the
 * user is allowed to see. The client doesn't reproduce gating logic.
 *
 * Mobile pattern (qb_elite_source/lib/src/features/weight_room/) merges
 * calendar days with admin-authored plan days via day_of_release. We do
 * the same here on the server, returning a Mon-Sun strip with each
 * day's matched workout (or null if rest day).
 */

export type DayOfRelease =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "running_day_1"
  | "running_day_2"
  | "optional";

export interface WorkoutPlan {
  id: string;
  name: string | null;
  description: string | null;
  tier: number;
  weekOfRelease: number;
  minAge: number | null;
  maxAge: number | null;
}

export interface WorkoutPlanDay {
  id: string;
  weekId: string;
  label: string | null;
  dayOfRelease: DayOfRelease | null;
  sortOrder: number;
}

export interface WorkoutPlanBlock {
  id: string;
  dayId: string;
  label: string;
  rounds: string;
  sortOrder: number;
}

export interface WorkoutPlanExercise {
  id: string;
  dayId: string;
  blockId: string | null;
  videoId: string | null;
  exerciseName: string;
  sets: number | null;
  reps: string | null;
  weight: string | null;
  time: string | null;
  notes: string | null;
  sortOrder: number;
}

const mapPlan = (db: any): WorkoutPlan => ({
  id: db.id,
  name: db.name ?? null,
  description: db.description ?? null,
  tier: db.tier ?? 1,
  weekOfRelease: db.week_of_release ?? 1,
  minAge: db.min_age ?? null,
  maxAge: db.max_age ?? null,
});

const mapDay = (db: any): WorkoutPlanDay => ({
  id: db.id,
  weekId: db.week_id,
  label: db.label ?? null,
  dayOfRelease: db.day_of_release ?? null,
  sortOrder: db.sort_order ?? 0,
});

const mapBlock = (db: any): WorkoutPlanBlock => ({
  id: db.id,
  dayId: db.day_id,
  label: db.label,
  rounds: db.rounds,
  sortOrder: db.sort_order ?? 0,
});

const mapExercise = (db: any): WorkoutPlanExercise => ({
  id: db.id,
  dayId: db.day_id,
  blockId: db.block_id ?? null,
  videoId: db.video_id ?? null,
  exerciseName: db.exercise_name,
  sets: db.sets ?? null,
  reps: db.reps ?? null,
  weight: db.weight ?? null,
  time: db.time ?? null,
  notes: db.notes ?? null,
  sortOrder: db.sort_order ?? 0,
});

/** Returns the user's current plan-week from the SECURITY DEFINER RPC. */
export async function getUserPlanWeek(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase.rpc("user_plan_week");
  if (error) {
    console.warn("user_plan_week rpc failed:", error.message);
    return 0;
  }
  return (data as number) ?? 0;
}

/**
 * Returns the active workout plan(s) the user is currently entitled to.
 * Could be more than one if the admin authors multiple Tier-1 plans for
 * different age bands, but RLS narrows to the user's match — typically 1.
 *
 * Week 0 plans (the free preview) come back too — that bypass clause is
 * baked into the RLS policy from F-004.
 */
export async function getUserWorkoutPlans(
  supabase: SupabaseClient
): Promise<WorkoutPlan[]> {
  const { data, error } = await supabase
    .from("workout_plans")
    .select("*")
    .order("week_of_release", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPlan);
}

/** Returns all days for a plan, ordered by sort_order. */
export async function getWorkoutPlanDays(
  supabase: SupabaseClient,
  planId: string
): Promise<WorkoutPlanDay[]> {
  const { data, error } = await supabase
    .from("workout_plan_days")
    .select("id, week_id, label, day_of_release, sort_order, workout_plan_weeks!inner(plan_id)")
    .eq("workout_plan_weeks.plan_id", planId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapDay);
}

/** All exercises across a list of days (one shot). Used for the
 *  Weekly Progress widget so we don't N+1 per day. */
export async function getWorkoutPlanExercisesForDays(
  supabase: SupabaseClient,
  dayIds: string[]
): Promise<WorkoutPlanExercise[]> {
  if (dayIds.length === 0) return [];
  const { data, error } = await supabase
    .from("workout_plan_exercises")
    .select("*")
    .in("day_id", dayIds)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapExercise);
}

// ───────────────────────────────────────────────────────────────────────
// User-scheduled exercises (F-006) — Starter-tier custom workout days.
// ───────────────────────────────────────────────────────────────────────

export interface ScheduledExercise {
  id: string;
  userId: string;
  scheduledDate: string; // yyyy-mm-dd
  workoutId: string;
  exerciseName: string;
  videoUrl: string | null;
  imageUrl: string | null;
  sets: number | null;
  reps: string | null;
  weight: string | null;
  notes: string | null;
  sortOrder: number;
  completedAt: string | null;
}

const mapScheduled = (db: any): ScheduledExercise => ({
  id: db.id,
  userId: db.user_id,
  scheduledDate: db.scheduled_date,
  workoutId: db.workout_id,
  // The workouts table only has `name` + `video_url` + `description`
  // (per shared/schema.ts in qb_elite_admin). Earlier versions of this
  // mapper asked for `title`/`image`/`image_url` too — those columns
  // don't exist, which caused the whole PostgREST query to error out
  // and return zero rows. That's why "Your additions" was invisible.
  exerciseName: db.workouts?.name ?? "",
  videoUrl: db.workouts?.video_url ?? null,
  imageUrl: null,
  sets: db.sets ?? null,
  reps: db.reps ?? null,
  weight: db.weight ?? null,
  notes: db.notes ?? null,
  sortOrder: db.sort_order ?? 0,
  completedAt: db.completed_at ?? null,
});

export async function getScheduledExercisesForDay(
  supabase: SupabaseClient,
  userId: string,
  isoDay: string
): Promise<ScheduledExercise[]> {
  const { data, error } = await supabase
    .from("user_scheduled_exercises")
    .select("*, workouts(id, name, video_url)")
    .eq("user_id", userId)
    .eq("scheduled_date", isoDay)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("scheduled exercises read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapScheduled);
}

/** IDs of `workout_plan_exercises` the user has marked complete. */
export async function getCompletedExerciseIds(
  supabase: SupabaseClient,
  userId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("workout_plan_exercise_completions")
    .select("exercise_id")
    .eq("user_id", userId);
  if (error) {
    console.warn("workout_plan_exercise_completions read failed:", error.message);
    return new Set();
  }
  return new Set(
    (data ?? []).map((r: any) => r.exercise_id as string).filter(Boolean)
  );
}

/** Returns blocks for a specific day, ordered by sort_order. */
export async function getWorkoutPlanBlocks(
  supabase: SupabaseClient,
  dayId: string
): Promise<WorkoutPlanBlock[]> {
  const { data, error } = await supabase
    .from("workout_plan_blocks")
    .select("*")
    .eq("day_id", dayId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapBlock);
}

/** Returns all exercises for a specific day, ordered by sort_order. */
export async function getWorkoutPlanExercises(
  supabase: SupabaseClient,
  dayId: string
): Promise<WorkoutPlanExercise[]> {
  const { data, error } = await supabase
    .from("workout_plan_exercises")
    .select("*")
    .eq("day_id", dayId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapExercise);
}

// ───────────────────────────────────────────────────────────────────────
// Training videos (workouts + categories) — matches Flutter weight room
// ───────────────────────────────────────────────────────────────────────

export interface WorkoutCategory {
  id: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface Workout {
  id: string;
  name: string;
  videoUrl: string;
  imageUrl: string | null;
  description: string | null;
}

const mapCategory = (db: any): WorkoutCategory => ({
  id: db.id,
  name: db.name ?? db.title ?? "",
  imageUrl: db.image ?? db.image_url ?? null,
  sortOrder: db.sort_order ?? 0,
});

const mapWorkout = (db: any): Workout => ({
  id: db.id,
  name: db.name ?? db.title ?? "",
  videoUrl: db.video_url ?? "",
  imageUrl: db.image ?? db.image_url ?? null,
  description: db.description ?? null,
});

export async function getWorkoutCategories(
  supabase: SupabaseClient
): Promise<WorkoutCategory[]> {
  const { data, error } = await supabase
    .from("workout_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("workout_categories fetch failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapCategory);
}

export async function getWorkoutsByCategory(
  supabase: SupabaseClient,
  categoryId: string
): Promise<Workout[]> {
  const { data: assignments, error: asnError } = await supabase
    .from("workout_category_assignments")
    .select("workout_id")
    .eq("category_id", categoryId)
    .limit(40);
  if (asnError) {
    console.warn("workout_category_assignments fetch failed:", asnError.message);
    return [];
  }
  const ids = (assignments ?? [])
    .map((r: any) => r.workout_id as string)
    .filter(Boolean);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .in("id", ids);
  if (error) {
    console.warn("workouts fetch failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapWorkout);
}
