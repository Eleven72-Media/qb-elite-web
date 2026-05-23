"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { Workout, WorkoutCategory } from "../queries";
import { TrainingVideoTile } from "./training-video-tile";

/**
 * Horizontal scrollable category chips + grid of workouts for the
 * selected category. Categories preload all their workouts client-side
 * (we already SSR'd the full set) so swapping chips is instant — no
 * round-trip per tap.
 */
export function CategoryPicker({
  categories,
  workoutsByCategory,
}: {
  categories: WorkoutCategory[];
  workoutsByCategory: Record<string, Workout[]>;
}) {
  const initialId = categories[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState<string>(initialId);

  if (categories.length === 0) return null;

  const workouts = workoutsByCategory[selectedId] ?? [];

  return (
    <>
      <div className="-mx-1 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 px-5 pb-2 md:px-6">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                selectedId === c.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-foreground ring-1 ring-[#D9D9D9]"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 md:px-6">
        {workouts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
            No videos in this category yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((w) => (
              <TrainingVideoTile key={w.id} workout={w} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
