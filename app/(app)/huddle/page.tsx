import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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

  if (huddles.length === 0) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">
          The Huddle
        </h1>
        <PaywallCard />
      </div>
    );
  }

  return (
    <div className="container space-y-8 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Live + recorded sessions
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          The Huddle
        </h1>
      </header>

      {regularUpcoming.length > 0 && (
        <Section title="Upcoming">
          {regularUpcoming.map((h) => (
            <HuddleCard key={h.id} huddle={h} />
          ))}
        </Section>
      )}

      {regularPast.length > 0 && (
        <Section title="Past Huddles">
          {regularPast.map((h) => (
            <HuddleCard key={h.id} huddle={h} compact />
          ))}
        </Section>
      )}

      {(filmStudyUpcoming.length > 0 || filmStudyPast.length > 0) && (
        <Section title="Film Study">
          {filmStudyUpcoming.map((h) => (
            <HuddleCard key={h.id} huddle={h} />
          ))}
          {filmStudyPast.map((h) => (
            <HuddleCard key={h.id} huddle={h} compact />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold uppercase tracking-tight">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">{children}</div>
    </section>
  );
}

function HuddleCard({
  huddle,
  compact,
}: {
  huddle: Huddle;
  compact?: boolean;
}) {
  const scheduled = huddle.scheduledAt ? new Date(huddle.scheduledAt) : null;
  const dateLabel = scheduled
    ? scheduled.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full bg-foreground/5">
        {huddle.imageUrl ? (
          <Image
            src={huddle.imageUrl}
            alt={huddle.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 640px) 33vw, 100vw"
          />
        ) : null}
        {huddle.videoUrl ? (
          <Badge
            variant="outline"
            className="absolute left-2 top-2 border-white/40 bg-black/60 text-white"
          >
            Recording
          </Badge>
        ) : (
          <Badge className="absolute left-2 top-2">Upcoming</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-sm font-semibold leading-tight">{huddle.title}</p>
        {!compact && huddle.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {huddle.description}
          </p>
        )}
        {dateLabel && (
          <p className="mt-auto text-[10px] font-semibold uppercase tracking-widest text-primary">
            {dateLabel}
            {huddle.duration ? ` · ${huddle.duration} min` : ""}
          </p>
        )}
      </div>
    </article>
  );
}

function PaywallCard() {
  return (
    <section className="mt-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/0 p-6 text-center">
      <h2 className="mb-2 text-xl font-extrabold uppercase tracking-tight">
        Join The Huddle
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Live group sessions with coaches and pro QBs. Recorded film studies
        and Q&A. Free during your 7-day trial.
      </p>
      <Link href="/paywall">
        <Button size="lg">Start Free Trial</Button>
      </Link>
    </section>
  );
}
