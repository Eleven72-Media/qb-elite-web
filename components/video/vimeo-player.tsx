"use client";

import Player from "@vimeo/player";
import { useEffect, useRef } from "react";

import {
  useVideoTracking,
  type VideoTrackingType,
} from "@/features/video-tracking/use-video-tracking";

interface VimeoPlayerProps {
  id: string;
  hash?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  tracking?: {
    videoType: VideoTrackingType;
    /** Override videoId used for tracking — defaults to the Vimeo id. */
    videoId?: string;
  };
}

// Vimeo Player.js SDK wrapper. We always use the SDK (not a plain iframe)
// so we can hook play / timeupdate / pause / ended events for tracking
// even when tracking is disabled. The SDK injects + manages its own
// iframe inside the container div.
export function VimeoPlayer({
  id,
  hash,
  autoplay = false,
  loop = false,
  className,
  tracking,
}: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const durationRef = useRef<number | undefined>(undefined);

  const trackingHandlers = useVideoTracking({
    enabled: !!tracking,
    videoId: tracking?.videoId ?? id,
    videoType: tracking?.videoType ?? "other",
    videoDurationSeconds: durationRef.current,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Use the id/h options pattern instead of url so we get strict
    // typing. autoplay/loop/muted are passed as boolean Player options.
    const player = new Player(containerRef.current, {
      id: Number(id),
      ...(hash ? { h: hash } : {}),
      autoplay,
      loop,
      muted: autoplay,
      responsive: true,
      title: false,
      byline: false,
      portrait: false,
    });
    playerRef.current = player;

    player.getDuration().then((d) => {
      durationRef.current = d;
    }).catch(() => {});

    player.on("play", trackingHandlers.onPlay);
    player.on("pause", trackingHandlers.onPause);
    player.on("ended", trackingHandlers.onEnded);
    player.on("timeupdate", (data: { seconds: number }) => {
      trackingHandlers.onTimeUpdate(data.seconds);
    });

    return () => {
      player.off("play");
      player.off("pause");
      player.off("ended");
      player.off("timeupdate");
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
    // Tracking handlers are stable across renders (memoized in the hook),
    // and the player should only be re-created when the video changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash, autoplay, loop]);

  return (
    <div
      className={
        "relative aspect-video w-full overflow-hidden bg-black " +
        (className ?? "")
      }
    >
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
