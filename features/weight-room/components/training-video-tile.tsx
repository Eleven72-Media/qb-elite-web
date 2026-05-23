import { Play } from "lucide-react";
import Image from "next/image";

import { vimeoThumbnailUrl } from "@/lib/vimeo";

import type { Workout } from "../queries";
import { ScheduleWorkoutButton } from "./schedule-workout-button";

/**
 * Card for a single training-video row. Thumbnail (image or Vimeo
 * fallback) on the left, title on the right, plus a "+" affordance
 * to schedule the workout into a custom day. Tapping the body opens
 * the source video in a new tab; the "+" stops propagation so the
 * two actions don't collide.
 */
export function TrainingVideoTile({ workout }: { workout: Workout }) {
  const thumb = workout.imageUrl ?? vimeoThumbnailUrl(workout.videoUrl);
  return (
    <li className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <a
        href={workout.videoUrl || "#"}
        target={workout.videoUrl ? "_blank" : undefined}
        rel="noreferrer"
        className="flex min-w-0 flex-1 items-center gap-3.5 active:opacity-95"
      >
        <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#E8EDF2]">
          {thumb && (
            <Image src={thumb} alt="" fill className="object-cover" sizes="100px" />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <Play className="h-5 w-5 text-white" fill="white" strokeWidth={0} />
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
            Weight Room
          </p>
          <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight">
            {workout.name}
          </p>
        </div>
      </a>
      <ScheduleWorkoutButton workoutId={workout.id} />
    </li>
  );
}
