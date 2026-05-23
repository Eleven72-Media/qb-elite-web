import type { SupabaseClient } from "@supabase/supabase-js";

export type VideoType = "qb_training" | "weight_room" | "nutrition";

export interface FavoriteVideo {
  id: string;
  videoId: string;
  videoType: VideoType;
  title: string;
  subtitle: string | null;
  videoLink: string | null;
  href: string;
}

/**
 * Loads everything the user has favorited and joins back to the source
 * tables (qb_trainings, nutrition_videos, weight_room_videos) so each
 * row has a title + playable link. RLS already filters favorite_videos
 * to the caller's user_id.
 */
export async function getUserFavorites(
  supabase: SupabaseClient
): Promise<FavoriteVideo[]> {
  const { data: favs } = await supabase
    .from("favorite_videos")
    .select("id, video_id, video_type, created_at")
    .order("created_at", { ascending: false });
  const rows = (favs ?? []) as Array<{
    id: string;
    video_id: string;
    video_type: VideoType;
    created_at: string;
  }>;
  if (rows.length === 0) return [];

  const byType: Record<VideoType, string[]> = {
    qb_training: [],
    weight_room: [],
    nutrition: [],
  };
  for (const r of rows) byType[r.video_type]?.push(r.video_id);

  const lookups = await Promise.all([
    byType.qb_training.length
      ? supabase
          .from("qb_trainings")
          .select("id, title, week_of_release, video_link")
          .in("id", byType.qb_training)
      : Promise.resolve({ data: [] as any[] }),
    byType.weight_room.length
      ? supabase
          .from("weight_room_videos")
          .select("id, title, video_link")
          .in("id", byType.weight_room)
      : Promise.resolve({ data: [] as any[] }),
    byType.nutrition.length
      ? supabase
          .from("nutrition_videos")
          .select("id, title, video_link")
          .in("id", byType.nutrition)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const qbMap = new Map<string, any>(
    (lookups[0].data ?? []).map((v) => [v.id, v])
  );
  const wrMap = new Map<string, any>(
    (lookups[1].data ?? []).map((v) => [v.id, v])
  );
  const nutMap = new Map<string, any>(
    (lookups[2].data ?? []).map((v) => [v.id, v])
  );

  const out: FavoriteVideo[] = [];
  for (const r of rows) {
    if (r.video_type === "qb_training") {
      const v = qbMap.get(r.video_id);
      if (!v) continue;
      out.push({
        id: r.id,
        videoId: r.video_id,
        videoType: r.video_type,
        title: v.title,
        subtitle: v.week_of_release ?? null,
        videoLink: v.video_link ?? null,
        href: `/classroom/video/${v.id}`,
      });
    } else if (r.video_type === "nutrition") {
      const v = nutMap.get(r.video_id);
      if (!v) continue;
      out.push({
        id: r.id,
        videoId: r.video_id,
        videoType: r.video_type,
        title: v.title,
        subtitle: "Nutrition video",
        videoLink: v.video_link ?? null,
        href: "/nutrition",
      });
    } else if (r.video_type === "weight_room") {
      const v = wrMap.get(r.video_id);
      if (!v) continue;
      out.push({
        id: r.id,
        videoId: r.video_id,
        videoType: r.video_type,
        title: v.title,
        subtitle: "Weight room",
        videoLink: v.video_link ?? null,
        href: "/weight-room",
      });
    }
  }
  return out;
}
