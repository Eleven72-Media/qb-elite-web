import { Calendar, Play, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getHuddles, type Huddle } from "@/features/huddle/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "The Huddle — QB Elite" };
export const dynamic = "force-dynamic";

export default async function HuddlePage() {
  const supabase = createClient();
  const huddles = await getHuddles(supabase);

  const now = new Date();
  const upcoming = huddles
    .filter((h) => h.scheduledAt && new Date(h.scheduledAt) > now && !h.videoUrl)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
    );
  const past = huddles
    .filter((h) => h.videoUrl)
    .sort(
      (a, b) =>
        new Date(b.scheduledAt ?? 0).getTime() -
        new Date(a.scheduledAt ?? 0).getTime()
    );

  const regularUpcoming = upcoming.filter((h) => h.type === "huddle");
  const filmStudyUpcoming = upcoming.filter((h) => h.type === "film_study");
  const regularPast = past.filter((h) => h.type === "huddle");
  const filmStudyPast = past.filter((h) => h.type === "film_study");

  return (
    <div className="mx-auto w-full max-w-[820px] pb-2">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <h1 className="text-[18px] font-bold leading-tight tracking-tight">
          The Huddle
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Live group sessions + recordings
        </p>
      </header>

      {huddles.length === 0 ? (
        <div className="px-5 md:px-6">
          <PaywallCard />
        </div>
      ) : (
        <>
          {regularUpcoming.length > 0 && (
            <Section title="Upcoming" icon={<Calendar className="h-[18px] w-[18px]" strokeWidth={2} />}>
              {regularUpcoming.map((h) => (
                <HuddleCard key={h.id} huddle={h} />
              ))}
            </Section>
          )}

          {regularPast.length > 0 && (
            <Section
              title="Past Huddles"
              trailing={`${regularPast.length} recording${regularPast.length === 1 ? "" : "s"}`}
            >
              {regularPast.map((h) => (
                <HuddleCard key={h.id} huddle={h} />
              ))}
            </Section>
          )}

          {(filmStudyUpcoming.length > 0 || filmStudyPast.length > 0) && (
            <Section title="Film Study">
              {filmStudyUpcoming.map((h) => (
                <HuddleCard key={h.id} huddle={h} />
              ))}
              {filmStudyPast.map((h) => (
                <HuddleCard key={h.id} huddle={h} />
              ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  trailing,
  icon,
  children,
}: {
  title: string;
  trailing?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-5 md:px-6">
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-foreground/70">{icon}</span>}
        <h2 className="text-[18px] font-bold tracking-tight">{title}</h2>
        {trailing && (
          <span className="ml-auto rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {trailing}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function HuddleCard({ huddle }: { huddle: Huddle }) {
  const scheduled = huddle.scheduledAt ? new Date(huddle.scheduledAt) : null;
  const dateLabel = scheduled
    ? scheduled.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;
  const isRecording = !!huddle.videoUrl;
  const href = isRecording && huddle.videoUrl ? huddle.videoUrl : null;

  const inner = (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="relative h-[160px] w-full bg-muted">
        {huddle.imageUrl ? (
          <Image
            src={huddle.imageUrl}
            alt={huddle.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 600px, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            <Video className="h-12 w-12" strokeWidth={1.5} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white ${
            isRecording ? "bg-black/60" : "bg-primary"
          }`}
        >
          {isRecording ? "Recording" : "Upcoming"}
        </span>
        {isRecording && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_0_20px_3px_rgba(182,31,38,0.35)]">
              <Play className="h-6 w-6 text-white" fill="white" strokeWidth={0} />
            </span>
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="line-clamp-2 text-[15px] font-bold leading-tight">
          {huddle.title}
        </p>
        {huddle.description && (
          <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">
            {huddle.description}
          </p>
        )}
        {dateLabel && (
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
            {dateLabel}
            {huddle.duration ? ` · ${huddle.duration} min` : ""}
          </p>
        )}
      </div>
    </article>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block active:opacity-95"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function PaywallCard() {
  return (
    <section className="mt-2 rounded-3xl bg-gradient-to-br from-primary/12 to-primary/0 p-6 text-center ring-1 ring-primary/15">
      <h2 className="mb-2 text-xl font-extrabold uppercase tracking-tight">
        Join The Huddle
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Live group sessions with coaches and pro QBs. Recorded film studies
        and Q&amp;A. Free during your 7-day trial.
      </p>
      <Link href="/paywall">
        <Button size="lg" className="rounded-full px-7">
          Start Free Trial
        </Button>
      </Link>
    </section>
  );
}
