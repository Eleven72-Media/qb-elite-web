import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
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
    <>
      <PageHeader title={training.week_of_release} backHref="/classroom" />
      <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-6 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-black shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
          <VideoPlayer src={training.video_link} autoplay />
        </div>

        <header className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              {training.week_of_release}
            </p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight tracking-tight">
              {training.title}
            </h1>
          </div>
          <FavoriteButton
            videoId={training.id}
            videoType="qb_training"
            initialFavorite={isFavorite}
          />
        </header>

        <CompleteVideoButton
          videoId={training.id}
          videoType="qb_training"
          initialCompleted={isCompleted}
        />
      </div>
    </>
  );
}
