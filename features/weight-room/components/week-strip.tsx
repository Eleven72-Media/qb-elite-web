import Link from "next/link";

import { cn } from "@/lib/utils";

import type { WorkoutPlanDay } from "../queries";
import {
  dayOfMonthLabel,
  isoDate,
  matchDay,
  shortDayLabel,
} from "../week-helpers";

/**
 * Mon-Sun strip showing today's date highlighted. Each day links to
 * the workout detail screen if there's a matching admin-authored
 * workout for that day_of_release; rest days are non-clickable.
 */
export function WeekStrip({
  dates,
  days,
}: {
  dates: Date[];
  days: WorkoutPlanDay[];
}) {
  const todayIso = isoDate(new Date());
  return (
    <ol className="grid grid-cols-7 gap-2">
      {dates.map((d) => {
        const matched = matchDay(d, days);
        const iso = isoDate(d);
        const isToday = iso === todayIso;
        const restDay = matched === null;
        const inner = (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl border py-3 transition-colors",
              restDay
                ? "bg-muted/40 text-muted-foreground"
                : "bg-card hover:border-primary",
              isToday && "border-primary ring-2 ring-primary/30"
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {shortDayLabel(d)}
            </span>
            <span className="text-lg font-bold">{dayOfMonthLabel(d)}</span>
            {restDay ? (
              <span className="text-[10px] text-muted-foreground">Rest</span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Workout
              </span>
            )}
          </div>
        );
        return (
          <li key={iso}>
            {restDay ? (
              inner
            ) : (
              <Link href={`/weight-room/workout/${iso}`}>{inner}</Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
