"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import type { WorkoutPlanDay } from "../queries";
import {
  cohortWeekForDate,
  dayOfMonthLabel,
  isoDate,
  matchDay,
  shortDayLabel,
} from "../week-helpers";

/**
 * Horizontally-scrollable Mon..Sun..Mon strip. The current week is the
 * first 7 cells, then the strip continues into future weeks (28 days
 * total by default). On mount the selected day auto-scrolls into the
 * center of the viewport so taps on a future date land you there
 * instead of always re-anchoring to today.
 *
 * Workout dots reflect the active plan: same weekday has the same
 * status every week (the plan loops), so e.g. if Mondays have a
 * workout, every Monday in the strip shows a green dot.
 */
export function WeekStrip({
  initialDates,
  days,
  selectedIso,
  basePath = "/weight-room",
  weekParam,
  currentWeek,
}: {
  initialDates: Date[];
  days: WorkoutPlanDay[];
  selectedIso: string;
  basePath?: string;
  /** Non-null when the picker has pinned a specific past/future week.
   *  Then *every* cell links to that same week, keeping the user in
   *  "viewing past" mode while they browse days. */
  weekParam?: string | null;
  /** User's current cohort plan_week (from `user_plan_week()`). Used
   *  to compute each cell's cohort week when `weekParam` is null. */
  currentWeek: number;
}) {
  const todayIso = isoDate(new Date());
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<HTMLLIElement | null>(null);

  // Center the selected day on first paint so future-week navigation
  // doesn't snap back to today.
  useEffect(() => {
    const sc = scrollerRef.current;
    const sel = selectedRef.current;
    if (!sc || !sel) return;
    const target =
      sel.offsetLeft - sc.clientWidth / 2 + sel.clientWidth / 2;
    sc.scrollTo({ left: Math.max(0, target), behavior: "auto" });
  }, [selectedIso]);

  return (
    <div className="rounded-2xl border border-[#E8E6E3] bg-white py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      <div
        ref={scrollerRef}
        className="overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ol className="flex w-max gap-1 px-2">
          {initialDates.map((d) => {
            const matched = matchDay(d, days);
            const iso = isoDate(d);
            const isSelected = iso === selectedIso;
            const isToday = iso === todayIso;
            const hasWorkout = matched !== null;

            const inner = (
              <div
                className={cn(
                  "flex w-10 flex-col items-center gap-1 rounded-2xl py-2 transition-colors",
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
            const cellWeek =
              weekParam ?? String(cohortWeekForDate(d, currentWeek));
            params.set("week", cellWeek);
            const href = `${basePath}?${params.toString()}`;

            return (
              <li
                key={iso}
                ref={isSelected ? selectedRef : null}
                className="shrink-0"
              >
                <Link href={href} scroll={false} className="block">
                  {inner}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
