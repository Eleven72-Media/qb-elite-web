import { Clock, ExternalLink, Film } from "lucide-react";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import {
  getUserFilmSubmissions,
  type FilmSubmission,
} from "@/features/film/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

import { SubmitFilmForm } from "./submit-film-form";

export const metadata = { title: "Film Breakdown — QB Elite" };
export const dynamic = "force-dynamic";

export default async function FilmBreakdownPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/huddle/film");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as { subscription_tier: SubscriptionTier } | null;

  if (!tierSatisfies(profile?.subscription_tier, "legend")) {
    return <UpgradeWall />;
  }

  const submissions = await getUserFilmSubmissions(supabase, user.id);

  return (
    <>
      <PageHeader title="Film Breakdown" backHref="/huddle" />
      <div className="mx-auto w-full max-w-[820px] space-y-6 px-5 pb-2 md:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/0 p-5 ring-1 ring-primary/15">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Legend tier · individual review
          </p>
          <h2 className="mt-1 text-[20px] font-bold leading-tight">
            Submit your clip
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop a YouTube, Vimeo, or Hudl link. A coach reviews it and posts
            written feedback — usually within a few days.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-[16px] font-bold tracking-tight">
            New submission
          </h3>
          <SubmitFilmForm userId={user.id} />
        </section>

        <section>
          <h3 className="mb-3 text-[16px] font-bold tracking-tight">
            Your submissions
          </h3>
          {submissions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
              No submissions yet. Send your first clip above.
            </p>
          ) : (
            <ul className="space-y-3">
              {submissions.map((s) => (
                <SubmissionCard key={s.id} submission={s} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function SubmissionCard({ submission }: { submission: FilmSubmission }) {
  const created = new Date(submission.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <li className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Film className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            {submission.videoLink ? (
              <a
                href={submission.videoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[14px] font-semibold text-primary hover:underline"
              >
                <span className="truncate">{submission.videoLink}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">(no link)</p>
            )}
            {submission.notes && (
              <p className="mt-1 line-clamp-3 text-sm text-foreground/80">
                {submission.notes}
              </p>
            )}
            <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <Clock className="h-3 w-3" strokeWidth={2} />
              {created}
            </p>
          </div>
          <StatusPill status={submission.status} />
        </div>
        {submission.feedback && (
          <div className="mt-3 rounded-xl border-l-4 border-primary bg-primary/5 p-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Coach feedback
            </p>
            <p className="whitespace-pre-line text-sm text-foreground/85">
              {submission.feedback}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    in_review: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function UpgradeWall() {
  return (
    <>
      <PageHeader title="Film Breakdown" backHref="/huddle" />
      <div className="mx-auto w-full max-w-md px-5 py-8 text-center md:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
          <Film className="h-10 w-10 text-primary" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          Legend feature
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">
          Individual film breakdown
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
          Send your game film for written coach feedback. Available on Legend
          and GOAT tiers.
        </p>
        <div className="mt-6">
          <a href="/paywall">
            <Button size="lg" className="rounded-full px-7">
              Upgrade to Legend
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
