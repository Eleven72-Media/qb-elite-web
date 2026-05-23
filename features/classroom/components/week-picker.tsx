"use client";

import { CalendarDays, ChevronDown, Lock, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function weekLabel(week: number) {
  return week === 0 ? "Intro" : `Week ${week}`;
}

/**
 * Calendar chip in the classroom header. Tap → dropdown of all weeks
 * the admin has authored. Past + current weeks navigate to
 * `/classroom?week=N` (filters page to that week's videos). Future weeks
 * are visible but disabled with a lock icon — same affordance as Flutter.
 */
export function WeekPicker({
  selectedWeek,
  currentWeek,
  allWeeks,
}: {
  selectedWeek: number;
  currentWeek: number;
  allWeeks: number[];
}) {
  const router = useRouter();

  function pick(week: number) {
    if (week > currentWeek) return;
    if (week === currentWeek) {
      router.push("/classroom");
    } else {
      router.push(`/classroom?week=${week}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary active:opacity-80"
        >
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          {weekLabel(selectedWeek)}
          <ChevronDown className="-ml-0.5 h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-80 w-44 overflow-y-auto rounded-xl bg-white p-1.5 shadow-lg"
      >
        {allWeeks.map((week) => {
          const locked = week > currentWeek;
          const isSelected = week === selectedWeek;
          return (
            <DropdownMenuItem
              key={week}
              disabled={locked}
              onSelect={(e) => {
                if (locked) {
                  e.preventDefault();
                  return;
                }
                pick(week);
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                isSelected
                  ? "bg-primary/10 text-primary"
                  : locked
                    ? "text-muted-foreground opacity-60"
                    : "text-foreground"
              }`}
            >
              {locked ? (
                <Lock className="h-4 w-4" strokeWidth={2} />
              ) : (
                <PlayCircle
                  className={`h-4 w-4 ${isSelected ? "text-primary" : "text-primary/80"}`}
                  strokeWidth={1.75}
                />
              )}
              <span className="font-semibold">{weekLabel(week)}</span>
              {isSelected && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary">
                  Viewing
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
