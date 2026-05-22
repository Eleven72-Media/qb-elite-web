import type { SupabaseClient } from "@supabase/supabase-js";

export interface AthleteResource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  sortOrder: number;
  createdAt: string | null;
}

const mapRow = (db: any): AthleteResource => ({
  id: db.id,
  title: db.title ?? "",
  description: db.description ?? "",
  imageUrl: db.image ?? "",
  externalUrl: db.external_url ?? "",
  sortOrder: db.sort_order ?? 0,
  createdAt: db.created_at ?? null,
});

export async function getAthleteResources(
  supabase: SupabaseClient
): Promise<AthleteResource[]> {
  const { data, error } = await supabase
    .from("athlete_resources")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}
