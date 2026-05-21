import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
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
    <div className="container max-w-2xl space-y-8 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Legend tier · individual review
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          Film Breakdown
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit a clip (YouTube, Vimeo, or any public link). A coach
          reviews it and posts written feedback usually within a few days.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight">
          Submit new clip
        </h2>
        <SubmitFilmForm userId={user.id} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight">
          Your submissions
        </h2>
        {submissions.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
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
  );
}

function SubmissionCard({ submission }: { submission: FilmSubmission }) {
  return (
    <li className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <a
            href={submission.videoLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {submission.videoLink || "(no link)"}
          </a>
          {submission.notes && (
            <p className="mt-1 text-sm text-muted-foreground">
              {submission.notes}
            </p>
          )}
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sent {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>
      {submission.feedback && (
        <div className="mt-3 rounded-md border-l-4 border-primary bg-primary/5 p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Coach feedback
          </p>
          <p className="whitespace-pre-line text-sm">{submission.feedback}</p>
        </div>
      )}
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    in_review: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return (
    <Badge variant="outline" className={tone[status] ?? "bg-muted"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

function UpgradeWall() {
  return (
    <div className="container max-w-md py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Legend feature
      </p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">
        Individual Film Breakdown
      </h1>
      <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
        Send your game film for written coach feedback. Available on
        Legend and GOAT tiers.
      </p>
      <a href="/paywall" className="mt-6 inline-block text-primary underline">
        Upgrade to Legend
      </a>
    </div>
  );
}
