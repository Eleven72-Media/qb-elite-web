import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  getQbTrainings,
  getUserQbTrainingWeek,
  groupByWeek,
  type QbTraining,
} from "@/features/classroom/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Classroom — QB Elite" };
export const dynamic = "force-dynamic";

export default async function ClassroomPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const supabase = createClient();
  const [trainings, userWeek] = await Promise.all([
    getQbTrainings(supabase),
    getUserQbTrainingWeek(supabase),
  ]);

  const groups = groupByWeek(trainings);
  const requestedWeek = searchParams.week
    ? parseInt(searchParams.week.replace(/[^0-9]/g, ""), 10)
    : null;
  const focused = requestedWeek !== null && !Number.isNaN(requestedWeek)
    ? groups.find((g) => g.week === requestedWeek) ?? null
    : null;

  return (
    <div className="container space-y-8 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {userWeek > 0 ? `You're on Week ${userWeek}` : "QB training library"}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight">
          Classroom
        </h1>
      </header>

      {focused && (
        <FocusedWeekRail group={focused} highlight />
      )}

      {groups.length === 0 ? (
        <EmptyState />
      ) : (
        groups.map((group) =>
          focused?.week === group.week ? null : (
            <WeekRail key={group.week} group={group} userWeek={userWeek} />
          )
        )
      )}
    </div>
  );
}

function WeekRail({
  group,
  userWeek,
}: {
  group: { week: number; trainings: QbTraining[] };
  userWeek: number;
}) {
  const isLocked = group.week > 0 && group.week > userWeek;
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-bold uppercase tracking-tight">
          {group.week === 0 ? "Intro" : group.week < 0 ? "Other" : `Week ${group.week}`}
        </h2>
        {isLocked && (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            Unlocks in week {group.week}
          </Badge>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {group.trainings.map((t) => (
          <TrainingCard key={t.id} training={t} locked={isLocked} />
        ))}
      </div>
    </section>
  );
}

function FocusedWeekRail({
  group,
  highlight,
}: {
  group: { week: number; trainings: QbTraining[] };
  highlight?: boolean;
}) {
  return (
    <section
      className={
        highlight
          ? "rounded-2xl border border-primary/30 bg-primary/5 p-5"
          : ""
      }
    >
      <div className="mb-3 flex items-baseline gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          From your link
        </p>
        <h2 className="text-lg font-bold uppercase tracking-tight">
          {group.week === 0 ? "Intro Videos" : `Week ${group.week}`}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {group.trainings.map((t) => (
          <TrainingCard key={t.id} training={t} locked={false} />
        ))}
      </div>
    </section>
  );
}

function TrainingCard({
  training,
  locked,
}: {
  training: QbTraining;
  locked: boolean;
}) {
  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full bg-foreground/5">
        <div className="flex h-full items-center justify-center text-3xl font-extrabold uppercase tracking-tight text-muted-foreground">
          QB
        </div>
        {locked && (
          <div className="absolute inset-0 grid place-items-center bg-black/40 text-xs font-bold uppercase tracking-widest text-white">
            Locked
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {training.weekOfRelease}
        </p>
        <p className="text-sm font-semibold leading-tight">{training.title}</p>
      </div>
    </article>
  );
  if (locked) return inner;
  return <Link href={`/classroom/video/${training.id}`}>{inner}</Link>;
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
      No QB trainings unlocked yet. Start your trial to unlock the weekly
      curriculum, or check back once admin authors content.
    </div>
  );
}
