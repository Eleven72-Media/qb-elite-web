import { notFound } from "next/navigation";

import { VideoPlayer } from "@/components/video/video-player";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { CompleteVideoButton } from "@/features/video-completion/components/complete-video-button";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Training — QB Elite" };
export const dynamic = "force-dynamic";

export default async function QbTrainingVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("qb_trainings")
    .select("id, title, week_of_release, video_link")
    .eq("id", params.id)
    .maybeSingle();

  const training = data as
    | { id: string; title: string; week_of_release: string; video_link: string }
    | null;
  if (!training) notFound();

  // Pre-fetch completion + favorite state for SSR so the buttons render
  // in their correct initial state with no flicker.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isCompleted = false;
  let isFavorite = false;
  if (user) {
    const { data: completion } = await supabase
      .from("video_completions")
      .select("video_id")
      .eq("user_id", user.id)
      .eq("video_id", training.id)
      .eq("video_type", "qb_training")
      .maybeSingle();
    isCompleted = !!completion;

    const { data: fav } = await supabase
      .from("favorite_videos")
      .select("video_id")
      .eq("user_id", user.id)
      .eq("video_id", training.id)
      .eq("video_type", "qb_training")
      .maybeSingle();
    isFavorite = !!fav;
  }

  return (
    <div className="container max-w-3xl space-y-6 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {training.week_of_release}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">
            {training.title}
          </h1>
          <FavoriteButton
            videoId={training.id}
            videoType="qb_training"
            initialFavorite={isFavorite}
          />
        </div>
      </header>
      <VideoPlayer src={training.video_link} autoplay />
      <CompleteVideoButton
        videoId={training.id}
        videoType="qb_training"
        initialCompleted={isCompleted}
      />
    </div>
  );
}
