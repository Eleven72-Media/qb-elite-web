import { Calendar, Clock, Crown } from "lucide-react";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
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
    <>
      <PageHeader title="1-on-1 Coaching" />
      <div className="mx-auto w-full max-w-[820px] space-y-6 px-5 pb-2 md:px-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/0 p-5 ring-1 ring-primary/15">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" strokeWidth={2.25} />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              GOAT tier
            </p>
          </div>
          <h2 className="mt-1 text-[20px] font-bold leading-tight">
            Schedule a session
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a slot below or send a request — Coach Miller will confirm.
          </p>
        </section>

        <UpcomingSessions sessions={sessions} />

        <section>
          <h3 className="mb-3 text-[16px] font-bold tracking-tight">
            Coach&apos;s weekly availability
          </h3>
          <AvailabilityGrid slots={availability} />
        </section>

        <section>
          <h3 className="mb-3 text-[16px] font-bold tracking-tight">
            Request a session
          </h3>
          <BookSessionForm
            userId={user.id}
            defaultName={profile?.display_name ?? ""}
            defaultEmail={profile?.email ?? user.email ?? ""}
          />
        </section>
      </div>
    </>
  );
}

function UpcomingSessions({ sessions }: { sessions: CoachingSession[] }) {
  if (sessions.length === 0) return null;
  return (
    <section>
      <h3 className="mb-3 text-[16px] font-bold tracking-tight">
        Upcoming sessions
      </h3>
      <ul className="space-y-3">
        {sessions.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-tight">
                {new Date(s.sessionDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" strokeWidth={2} />
                {timeLabel(s.startTime)}
                {s.endTime ? ` – ${timeLabel(s.endTime)}` : ""}
              </p>
            </div>
            <StatusPill status={s.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone[status] ?? "bg-muted"}`}
    >
      {status}
    </span>
  );
}

function AvailabilityGrid({ slots }: { slots: CoachingAvailability[] }) {
  if (slots.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
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
    <ul className="space-y-2.5">
      {Array.from(byDay.entries())
        .sort(([a], [b]) => a - b)
        .map(([day, daySlots]) => (
          <li
            key={day}
            className="rounded-2xl border border-border/60 bg-white p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              {dayOfWeekLabel(day)}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {daySlots
                .map(
                  (s) =>
                    `${timeLabel(s.startTime)}–${timeLabel(s.endTime)} (${s.sessionDuration}-min)`
                )
                .join(", ")}
            </p>
          </li>
        ))}
    </ul>
  );
}

function UpgradeWall() {
  return (
    <>
      <PageHeader title="1-on-1 Coaching" />
      <div className="mx-auto w-full max-w-md px-5 py-8 text-center md:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
          <Crown className="h-10 w-10 text-primary" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          GOAT tier
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">
          Custom-priced coaching
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
          GOAT is our 1-on-1 coaching tier. Custom-priced per athlete based on
          frequency + format. Reach out to Coach Miller for a quote.
        </p>
        <div className="mt-6">
          <a href="mailto:eleven72media@gmail.com?subject=QB%20Elite%20GOAT%20Tier%20%E2%80%94%20pricing%20inquiry">
            <Button size="lg" className="rounded-full px-7">
              Contact Coach Miller
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
