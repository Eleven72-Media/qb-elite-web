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
 * Mon-Sun pill strip — selected/today is filled red with white text,
 * regular days show a small primary dot when they have a workout, no
 * dot if it's a rest day. Mirrors the Flutter planner week strip.
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
    <div className="rounded-2xl border border-[#E8E6E3] bg-white px-2 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      <ol className="grid grid-cols-7 gap-1">
        {dates.map((d) => {
          const matched = matchDay(d, days);
          const iso = isoDate(d);
          const isToday = iso === todayIso;
          const hasWorkout = matched !== null;
          const inner = (
            <div
              className={cn(
                "mx-auto flex w-10 flex-col items-center gap-1 rounded-2xl py-2 transition-colors",
                isToday && "bg-primary shadow-[0_2px_8px_rgba(182,31,38,0.3)]"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase",
                  isToday ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {shortDayLabel(d).slice(0, 2)}
              </span>
              <span
                className={cn(
                  "text-[15px] font-bold leading-none",
                  isToday ? "text-white" : "text-foreground"
                )}
              >
                {dayOfMonthLabel(d)}
              </span>
              <span
                className={cn(
                  "mt-0.5 inline-block h-1 w-1 rounded-full",
                  hasWorkout
                    ? isToday
                      ? "bg-white"
                      : "bg-primary"
                    : "bg-transparent"
                )}
              />
            </div>
          );
          return (
            <li key={iso} className="flex justify-center">
              {hasWorkout ? (
                <Link href={`/weight-room/workout/${iso}`} className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
