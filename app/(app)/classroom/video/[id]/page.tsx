import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Training — QB Elite" };
export const dynamic = "force-dynamic";

/**
 * Sprint 2 stub. Resolves the training row so the page proves the
 * deep-link works end-to-end; the actual Vimeo player wires up in
 * Sprint 3.
 */
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

  return (
    <div className="container max-w-3xl space-y-6 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {training.week_of_release}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          {training.title}
        </h1>
      </header>
      <div className="grid place-items-center rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
        Video player ships in Sprint 3 — this is a routing stub. The video
        URL on file: <span className="font-mono">{training.video_link}</span>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" disabled>
          Mark Complete (Sprint 3)
        </Button>
      </div>
    </div>
  );
}
