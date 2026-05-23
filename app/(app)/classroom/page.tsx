import { CalendarDays, Lock, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getQbTrainings,
  getUserQbTrainingWeek,
  type QbTraining,
} from "@/features/classroom/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import { vimeoThumbnailUrl } from "@/lib/vimeo";
import type { SubscriptionTier } from "@/types/db";

export const metadata = { title: "Classroom — QB Elite" };
export const dynamic = "force-dynamic";

export default async function ClassroomPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [trainings, userWeek, profileRes] = await Promise.all([
    getQbTrainings(supabase),
    getUserQbTrainingWeek(supabase),
    user
      ? supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const tier = (profileRes.data as { subscription_tier: SubscriptionTier } | null)
    ?.subscription_tier;
  const isFree = !tierSatisfies(tier, "starter");
  const effectiveWeek = isFree ? 0 : userWeek;

  const sorted = [...trainings].sort((a, b) => {
    const aw = a.weekNumber ?? 999;
    const bw = b.weekNumber ?? 999;
    if (aw !== bw) return aw - bw;
    return a.title.localeCompare(b.title);
  });
  const available = sorted.filter(
    (t) => t.weekNumber != null && t.weekNumber <= effectiveWeek
  );
  const locked = sorted.filter(
    (t) => t.weekNumber == null || t.weekNumber > effectiveWeek
  );

  const featured = available[0] ?? locked[0] ?? null;
  const featuredLocked = available.length === 0 && !!featured;
  const restAvailable = available.slice(1);

  return (
    <div className="mx-auto w-full max-w-[820px] pb-2">
      <ClassroomHeader effectiveWeek={effectiveWeek} />

      {isFree && (
        <Link
          href="/paywall"
          className="mx-5 mt-1 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-4 py-3 shadow-sm active:opacity-95 md:mx-6"
        >
          <Lock className="h-5 w-5 text-white" strokeWidth={2} />
          <span className="flex-1 text-xs font-semibold text-white">
            Upgrade to unlock all weekly training videos
          </span>
          <span className="text-white/70">›</span>
        </Link>
      )}

      {featured && (
        <FeaturedCard
          training={featured}
          locked={featuredLocked}
          availableCount={available.length}
        />
      )}

      {restAvailable.length > 0 && (
        <Section
          title="This Week"
          trailing={`${restAvailable.length} more`}
        >
          {restAvailable.map((t) => (
            <VideoTile key={t.id} training={t} locked={false} />
          ))}
        </Section>
      )}

      {locked.length > 0 && (
        <Section
          title="Upcoming"
          trailing={`${locked.length} video${locked.length === 1 ? "" : "s"}`}
          locked
        >
          {locked.slice(0, available.length === 0 ? locked.length - 1 : locked.length).map((t) => (
            <VideoTile key={t.id} training={t} locked />
          ))}
        </Section>
      )}

      {available.length === 0 && locked.length === 0 && (
        <EmptyState />
      )}
    </div>
  );
}

function ClassroomHeader({ effectiveWeek }: { effectiveWeek: number }) {
  return (
    <header className="px-5 pb-3 pt-1 md:px-6">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-[18px] font-bold leading-tight tracking-tight">
            The Classroom
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your weekly training sessions
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          {effectiveWeek === 0 ? "Intro" : `Week ${effectiveWeek}`}
        </span>
      </div>
    </header>
  );
}

function FeaturedCard({
  training,
  locked,
  availableCount,
}: {
  training: QbTraining;
  locked: boolean;
  availableCount: number;
}) {
  const thumb = vimeoThumbnailUrl(training.videoLink);
  const inner = (
    <div className="relative h-[230px] w-full overflow-hidden rounded-3xl bg-primary shadow-[0_10px_28px_rgba(182,31,38,0.12)]">
      {thumb && (
        <Image
          src={thumb}
          alt={training.title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 760px, 100vw"
          priority
        />
      )}
      <div
        className={`pointer-events-none absolute inset-0 ${
          locked
            ? "bg-gradient-to-b from-black/45 via-black/25 to-black/85"
            : "bg-gradient-to-b from-black/15 via-transparent to-black/80"
        }`}
      />
      {!locked && availableCount > 0 && (
        <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white">
          <Play className="h-3 w-3" fill="white" strokeWidth={0} />
          {availableCount} available
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full ${
            locked ? "bg-black/35" : "bg-primary shadow-[0_0_22px_4px_rgba(182,31,38,0.45)]"
          }`}
        >
          {locked ? (
            <Lock className="h-7 w-7 text-white" strokeWidth={2.25} />
          ) : (
            <Play className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
          )}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white ${
              locked ? "bg-white/15" : "bg-primary"
            }`}
          >
            {locked ? "LOCKED" : "FEATURED"}
          </span>
          <span className="text-xs font-medium text-white/70">
            {training.weekOfRelease}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[18px] font-bold leading-tight text-white">
          {training.title}
        </p>
        {availableCount > 1 && (
          <p className="mt-1 text-xs text-white/65">
            + {availableCount - 1} more video{availableCount - 1 > 1 ? "s" : ""} this week
          </p>
        )}
      </div>
    </div>
  );
  if (locked) {
    return <div className="mx-5 mt-2.5 mb-2 md:mx-6">{inner}</div>;
  }
  return (
    <Link
      href={`/classroom/video/${training.id}`}
      className="block px-5 pb-2 pt-2.5 active:opacity-95 md:px-6"
    >
      {inner}
    </Link>
  );
}

function Section({
  title,
  trailing,
  locked = false,
  children,
}: {
  title: string;
  trailing?: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-6 md:px-6">
      <div className="mb-3.5 flex items-center gap-2">
        {locked && (
          <Lock className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={2} />
        )}
        <h2
          className={`text-[18px] font-bold tracking-tight ${
            locked ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {title}
        </h2>
        {trailing && (
          <span className="ml-auto rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {trailing}
          </span>
        )}
      </div>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function VideoTile({
  training,
  locked,
}: {
  training: QbTraining;
  locked: boolean;
}) {
  const thumb = vimeoThumbnailUrl(training.videoLink);
  const inner = (
    <div
      className={`flex items-center gap-3.5 rounded-2xl border bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
        locked ? "border-border opacity-60" : "border-border/60"
      }`}
    >
      <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#E8EDF2]">
        {thumb && (
          <Image src={thumb} alt="" fill className="object-cover" sizes="100px" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {locked ? (
            <div className="flex h-full w-full items-center justify-center bg-black/30 backdrop-blur-[2px]">
              <Lock className="h-[22px] w-[22px] text-white/80" strokeWidth={2} />
            </div>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <Play className="h-5 w-5 text-white" fill="white" strokeWidth={0} />
            </span>
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${
            locked ? "text-muted-foreground" : "text-primary"
          }`}
        >
          {training.weekOfRelease}
        </p>
        <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight">
          {training.title}
        </p>
      </div>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          locked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
        }`}
      >
        {locked ? (
          <Lock className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Play className="h-5 w-5" fill="currentColor" strokeWidth={0} />
        )}
      </span>
    </div>
  );
  if (locked) return inner;
  return (
    <Link href={`/classroom/video/${training.id}`} className="block active:opacity-95">
      {inner}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-10 pt-16 text-center">
      <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-gradient-radial from-primary/15 to-primary/5">
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/60"
        >
          <path d="M3 9.5 12 5l9 4.5L12 14 3 9.5Z" />
          <path d="M7 12v4.5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5V12" />
        </svg>
      </div>
      <h2 className="mt-7 text-[22px] font-bold">No Videos Available</h2>
      <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
        New content unlocks each week.
        <br />
        Check back soon!
      </p>
    </div>
  );
}
