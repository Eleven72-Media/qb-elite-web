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
 * Mon-Sun pill strip. The currently-selected day fills with primary
 * red and renders a small green dot under any day that has a workout.
 * Tapping a date navigates the page to `/weight-room?day=<iso>` so the
 * workout preview card below updates to that day.
 */
export function WeekStrip({
  initialDates,
  days,
  selectedIso,
  basePath = "/weight-room",
  weekParam,
}: {
  initialDates: Date[];
  days: WorkoutPlanDay[];
  selectedIso: string;
  basePath?: string;
  /** Pass-through so the chosen week chip stays selected across day taps. */
  weekParam?: string | null;
}) {
  const todayIso = isoDate(new Date());
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-[#E8E6E3] bg-white px-1 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      <Arrow dir="left" disabled />
      <ol className="grid flex-1 grid-cols-7 gap-1">
        {initialDates.map((d) => {
          const matched = matchDay(d, days);
          const iso = isoDate(d);
          const isSelected = iso === selectedIso;
          const isToday = iso === todayIso;
          const hasWorkout = matched !== null;

          const inner = (
            <div
              className={cn(
                "mx-auto flex w-10 flex-col items-center gap-1 rounded-2xl py-2 transition-colors",
                isSelected && "bg-primary shadow-[0_2px_8px_rgba(182,31,38,0.3)]"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {shortDayLabel(d).slice(0, 2)}
              </span>
              <span
                className={cn(
                  "text-[15px] font-bold leading-none",
                  isSelected
                    ? "text-white"
                    : isToday
                      ? "text-primary"
                      : "text-foreground"
                )}
              >
                {dayOfMonthLabel(d)}
              </span>
              <span
                className={cn(
                  "mt-0.5 inline-block h-[5px] w-[5px] rounded-full",
                  hasWorkout
                    ? isSelected
                      ? "bg-white"
                      : "bg-[#ACC420]"
                    : "bg-transparent"
                )}
              />
            </div>
          );

          const params = new URLSearchParams();
          params.set("day", iso);
          if (weekParam) params.set("week", weekParam);
          const href = `${basePath}?${params.toString()}`;

          return (
            <li key={iso} className="flex justify-center">
              <Link href={href} scroll={false} className="block">
                {inner}
              </Link>
            </li>
          );
        })}
      </ol>
      <Arrow dir="right" disabled />
    </div>
  );
}

function Arrow({
  dir,
  disabled,
}: {
  dir: "left" | "right";
  disabled: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-11 w-7 items-center justify-center",
        disabled ? "text-muted-foreground/30" : "text-muted-foreground"
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </span>
  );
}
