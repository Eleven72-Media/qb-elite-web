import { Play } from "lucide-react";
import Image from "next/image";

import { vimeoThumbnailUrl } from "@/lib/vimeo";

import type { Workout } from "../queries";

/**
 * Card for a single training-video row. Uses the workout's image when
 * present, otherwise pulls a Vimeo thumbnail from its video URL.
 */
export function TrainingVideoTile({ workout }: { workout: Workout }) {
  const thumb = workout.imageUrl ?? vimeoThumbnailUrl(workout.videoUrl);
  return (
    <li>
      <a
        href={workout.videoUrl || "#"}
        target={workout.videoUrl ? "_blank" : undefined}
        rel="noreferrer"
        className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:opacity-95"
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
    </li>
  );
}
