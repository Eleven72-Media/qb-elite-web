import type { SupabaseClient } from "@supabase/supabase-js";

export interface FilmSubmission {
  id: string;
  userId: string;
  videoLink: string;
  notes: string;
  feedback: string | null;
  status: "pending" | "in_review" | "completed" | string;
  createdAt: string;
  updatedAt: string;
}

const mapSubmission = (db: any): FilmSubmission => ({
  id: db.id,
  userId: db.user_id,
  videoLink: db.video_link ?? "",
  notes: db.notes ?? "",
  feedback: db.feedback ?? null,
  status: db.status ?? "pending",
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export async function getUserFilmSubmissions(
  supabase: SupabaseClient,
  userId: string
): Promise<FilmSubmission[]> {
  const { data, error } = await supabase
    .from("film_submissions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map(mapSubmission);
}
