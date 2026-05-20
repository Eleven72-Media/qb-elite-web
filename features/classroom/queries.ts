import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Classroom (QB Trainings) data.
 *
 * qb_trainings stores week_of_release as a string ("Week 0", "Week 1",
 * "2025-01-06"…) — the mobile app parses the integer out via regex.
 * We do the same so weeks group/sort numerically.
 */

export interface QbTraining {
  id: string;
  categoryId: string;
  title: string;
  weekOfRelease: string;
  weekNumber: number | null;
  videoLink: string;
  isIntro: boolean;
}

const weekNumberFrom = (raw: string): number | null => {
  const match = /[Ww]eek\s*(\d+)/.exec(raw);
  if (!match) return null;
  const n = parseInt(match[1] ?? "", 10);
  return Number.isNaN(n) ? null : n;
};

const mapTraining = (db: any): QbTraining => ({
  id: db.id,
  categoryId: db.category_id,
  title: db.title,
  weekOfRelease: db.week_of_release ?? "",
  weekNumber: weekNumberFrom(db.week_of_release ?? ""),
  videoLink: db.video_link ?? "",
  isIntro: db.is_intro ?? false,
});

export async function getQbTrainings(
  supabase: SupabaseClient
): Promise<QbTraining[]> {
  const { data, error } = await supabase
    .from("qb_trainings")
    .select("*")
    .order("week_of_release", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTraining);
}

export async function getUserQbTrainingWeek(
  supabase: SupabaseClient
): Promise<number> {
  const { data, error } = await supabase.rpc("user_qb_training_week");
  if (error) {
    console.warn("user_qb_training_week rpc failed:", error.message);
    return 0;
  }
  return (data as number) ?? 0;
}

export function groupByWeek(
  trainings: QbTraining[]
): Array<{ week: number; trainings: QbTraining[] }> {
  const buckets = new Map<number, QbTraining[]>();
  for (const t of trainings) {
    const w = t.weekNumber ?? -1; // ungrouped trainings under -1
    if (!buckets.has(w)) buckets.set(w, []);
    buckets.get(w)!.push(t);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, items]) => ({ week, trainings: items }));
}

/** Vimeo thumbnail. Returns null if URL isn't recognized. */
export function vimeoThumbnail(videoLink: string): string | null {
  // Vimeo player URLs: https://player.vimeo.com/video/<id>?h=<hash>
  // We can't synthesize a thumbnail URL without calling Vimeo's oEmbed API;
  // null falls back to a brand placeholder on the card.
  return videoLink.includes("vimeo.com") ? null : null;
}
