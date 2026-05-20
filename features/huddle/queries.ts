import type { SupabaseClient } from "@supabase/supabase-js";

export interface Huddle {
  id: string;
  title: string;
  description: string | null;
  type: "huddle" | "film_study";
  scheduledAt: string | null;
  duration: number | null;
  status: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

const mapHuddle = (db: any): Huddle => ({
  id: db.id,
  title: db.title ?? "",
  description: db.description ?? null,
  type: (db.type ?? "huddle") as "huddle" | "film_study",
  scheduledAt: db.scheduled_at ?? null,
  duration: db.duration ?? null,
  status: db.status ?? null,
  imageUrl: db.image_url ?? db.image ?? null,
  videoUrl: db.video_url ?? null,
});

export async function getHuddles(supabase: SupabaseClient): Promise<Huddle[]> {
  const { data, error } = await supabase
    .from("huddles")
    .select("*")
    .order("scheduled_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map(mapHuddle);
}
