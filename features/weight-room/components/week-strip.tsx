"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { WorkoutPlanDay } from "../queries";
import {
  dayOfMonthLabel,
  isoDate,
  matchDay,
  shortDayLabel,
} from "../week-helpers";

/**
 * Flutter-parity week strip: bordered white card, chevron arrows on
 * left + right shift the visible week, day pills with red selected
 * state, green dot under days that have a workout (white when selected).
 */
export function WeekStrip({
  initialDates,
  days,
  selectedIso: selectedIsoProp,
  onSelect,
}: {
  initialDates: Date[];
  days: WorkoutPlanDay[];
  selectedIso?: string;
  onSelect?: (iso: string) => void;
}) {
  // The strip is a controlled component for the parent's selected day,
  // but it manages its own "anchor" so the user can scrub through weeks
  // without ever leaving the home screen.
  const todayIso = isoDate(new Date());
  const anchor = initialDates[0] ?? new Date();
  const [weekStart, setWeekStart] = useState<Date>(anchor);

  const visible: Date[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  function shiftWeek(deltaDays: number) {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + deltaDays);
    setWeekStart(next);
  }

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-[#E8E6E3] bg-white px-1 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      <Arrow
        dir="left"
        onClick={() => shiftWeek(-7)}
        ariaLabel="Previous week"
      />
      <ol className="grid flex-1 grid-cols-7 gap-1">
        {visible.map((d) => {
          const matched = matchDay(d, days);
          const iso = isoDate(d);
          const isToday = iso === todayIso;
          const isSelected = selectedIsoProp
            ? iso === selectedIsoProp
            : isToday;
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

          if (onSelect) {
            return (
              <li key={iso} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(iso)}
                  className="block"
                >
                  {inner}
                </button>
              </li>
            );
          }
          return (
            <li key={iso} className="flex justify-center">
              {hasWorkout ? (
                <Link
                  href={`/weight-room/workout/${iso}`}
                  className="block"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>
      <Arrow
        dir="right"
        onClick={() => shiftWeek(7)}
        ariaLabel="Next week"
      />
    </div>
  );
}

function Arrow({
  dir,
  onClick,
  ariaLabel,
}: {
  dir: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-11 w-7 items-center justify-center text-muted-foreground active:opacity-60"
    >
      {dir === "left" ? (
        <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={1.75} />
      ) : (
        <ChevronRight className="h-[22px] w-[22px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
