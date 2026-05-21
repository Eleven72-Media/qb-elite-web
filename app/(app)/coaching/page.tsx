import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  dayOfWeekLabel,
  getActiveAvailability,
  getUserUpcomingSessions,
  timeLabel,
  type CoachingAvailability,
  type CoachingSession,
} from "@/features/coaching/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

import { BookSessionForm } from "./book-session-form";

export const metadata = { title: "1-on-1 Coaching — QB Elite" };
export const dynamic = "force-dynamic";

export default async function CoachingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/coaching");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("subscription_tier, display_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as
    | { subscription_tier: SubscriptionTier; display_name: string | null; email: string | null }
    | null;

  if (!tierSatisfies(profile?.subscription_tier, "goat")) {
    return <UpgradeWall />;
  }

  const [availability, sessions] = await Promise.all([
    getActiveAvailability(supabase),
    getUserUpcomingSessions(supabase, user.id),
  ]);

  return (
    <div className="container max-w-3xl space-y-8 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          GOAT — 1-on-1 coaching
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          Schedule a Session
        </h1>
      </header>

      <UpcomingSessions sessions={sessions} />

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight">
          Coach&apos;s weekly availability
        </h2>
        <AvailabilityGrid slots={availability} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold uppercase tracking-tight">
          Request a session
        </h2>
        <BookSessionForm
          userId={user.id}
          defaultName={profile?.display_name ?? ""}
          defaultEmail={profile?.email ?? user.email ?? ""}
        />
      </section>
    </div>
  );
}

function UpcomingSessions({ sessions }: { sessions: CoachingSession[] }) {
  if (sessions.length === 0) {
    return (
      <section className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        No upcoming sessions. Request one below.
      </section>
    );
  }
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold uppercase tracking-tight">
        Upcoming sessions
      </h2>
      <ul className="space-y-2">
        {sessions.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold">
                {new Date(s.sessionDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {timeLabel(s.startTime)}
                {s.endTime ? ` – ${timeLabel(s.endTime)}` : ""}
              </p>
            </div>
            <StatusBadge status={s.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <Badge variant="outline" className={tone[status] ?? "bg-muted"}>
      {status}
    </Badge>
  );
}

function AvailabilityGrid({ slots }: { slots: CoachingAvailability[] }) {
  if (slots.length === 0) {
    return (
      <p className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        Coach hasn&apos;t posted availability yet. Use the form below and we&apos;ll get back to you.
      </p>
    );
  }
  const byDay = new Map<number, CoachingAvailability[]>();
  for (const s of slots) {
    if (!byDay.has(s.dayOfWeek)) byDay.set(s.dayOfWeek, []);
    byDay.get(s.dayOfWeek)!.push(s);
  }
  return (
    <ul className="space-y-2">
      {Array.from(byDay.entries())
        .sort(([a], [b]) => a - b)
        .map(([day, daySlots]) => (
          <li
            key={day}
            className="flex flex-wrap items-baseline gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <span className="min-w-[5rem] text-[10px] font-bold uppercase tracking-widest text-primary">
              {dayOfWeekLabel(day)}
            </span>
            <span className="text-sm">
              {daySlots
                .map(
                  (s) =>
                    `${timeLabel(s.startTime)}–${timeLabel(s.endTime)} (${s.sessionDuration}-min)`
                )
                .join(", ")}
            </span>
          </li>
        ))}
    </ul>
  );
}

function UpgradeWall() {
  return (
    <div className="container max-w-md py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        GOAT — 1-on-1 Coaching
      </p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">
        Custom-priced coaching
      </h1>
      <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
        GOAT is our 1-on-1 coaching tier. Custom-priced per athlete based on
        frequency + format. Reach out to Coach Miller for a quote.
      </p>
      <div className="mt-6">
        <a href="mailto:eleven72media@gmail.com?subject=QB%20Elite%20GOAT%20Tier%20%E2%80%94%20pricing%20inquiry">
          <Button size="lg">Contact Coach Miller</Button>
        </a>
      </div>
    </div>
  );
}
