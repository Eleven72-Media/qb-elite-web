"use client";

import { useCallback, useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

export type VideoTrackingType =
  | "qb_training"
  | "weight_room"
  | "nutrition"
  | "home_slider"
  | "other";

interface UseVideoTrackingArgs {
  enabled: boolean;
  videoId: string;
  videoType: VideoTrackingType;
  videoDurationSeconds?: number;
}

// Writes once-per-play-session rows to video_play_events with a running
// watched_seconds counter that ticks every ~5s during active playback.
// Tick is throttled to keep network traffic + DB writes low; a final
// best-effort flush fires on pause/end/unmount/pagehide. Some loss on
// abrupt tab close is acceptable — the 5s cadence caps the worst case.
const TICK_INTERVAL_MS = 5_000;

export function useVideoTracking({
  enabled,
  videoId,
  videoType,
  videoDurationSeconds,
}: UseVideoTrackingArgs) {
  const supabase = createClient();
  const sessionIdRef = useRef<string | null>(null);
  const watchedSecondsRef = useRef(0);
  const lastTickAtRef = useRef<number>(0);
  const playingRef = useRef(false);
  const lastPlayheadRef = useRef<number>(0);

  // Inserts a fresh session row on the first play of this mount.
  const startSession = useCallback(async () => {
    if (sessionIdRef.current) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("video_play_events")
      .insert({
        user_id: user.id,
        video_id: videoId,
        video_type: videoType,
        source: "web",
        watched_seconds: 0,
        video_duration_seconds: videoDurationSeconds ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      // Tracking must never break playback — swallow + log.
      console.warn("video tracking: session start failed", error?.message);
      return;
    }
    sessionIdRef.current = data.id as string;
  }, [supabase, videoId, videoType, videoDurationSeconds]);

  // Writes the current watched_seconds to the open session row. Cheap
  // because it's a single-row UPDATE keyed on PK.
  const flush = useCallback(
    async (opts?: { completed?: boolean }) => {
      const id = sessionIdRef.current;
      if (!id) return;
      const seconds = Math.round(watchedSecondsRef.current);
      const completed = opts?.completed ?? false;
      const { error } = await supabase
        .from("video_play_events")
        .update({
          watched_seconds: seconds,
          last_event_at: new Date().toISOString(),
          completed,
        })
        .eq("id", id);
      if (error) {
        console.warn("video tracking: flush failed", error.message);
      }
    },
    [supabase]
  );

  // Best-effort flush on tab close / route change. We can't await on
  // pagehide, so accept the chance of in-flight loss. The next page
  // load will start a new session — no double counting.
  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      if (sessionIdRef.current && playingRef.current) {
        void flush();
      }
    };
    window.addEventListener("pagehide", handler);
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("pagehide", handler);
      window.removeEventListener("beforeunload", handler);
      // Component unmount: also flush whatever we have.
      if (sessionIdRef.current) {
        void flush();
      }
    };
  }, [enabled, flush]);

  // Reset session on video change (different videoId in same player slot).
  useEffect(() => {
    sessionIdRef.current = null;
    watchedSecondsRef.current = 0;
    lastTickAtRef.current = 0;
    playingRef.current = false;
    lastPlayheadRef.current = 0;
  }, [videoId]);

  const onPlay = useCallback(() => {
    if (!enabled) return;
    playingRef.current = true;
    if (!sessionIdRef.current) {
      void startSession();
    }
  }, [enabled, startSession]);

  const onTimeUpdate = useCallback(
    (currentTimeSeconds: number) => {
      if (!enabled || !playingRef.current) return;

      const delta = currentTimeSeconds - lastPlayheadRef.current;
      // Guard against seek-jumps (forward skips or back-scrubs). Only
      // accrue when the playhead moved naturally — within one polling
      // window plus a small buffer.
      if (delta > 0 && delta < 2.0) {
        watchedSecondsRef.current += delta;
      }
      lastPlayheadRef.current = currentTimeSeconds;

      const now = Date.now();
      if (now - lastTickAtRef.current >= TICK_INTERVAL_MS) {
        lastTickAtRef.current = now;
        void flush();
      }
    },
    [enabled, flush]
  );

  const onPause = useCallback(() => {
    if (!enabled) return;
    playingRef.current = false;
    if (sessionIdRef.current) void flush();
  }, [enabled, flush]);

  const onEnded = useCallback(() => {
    if (!enabled) return;
    playingRef.current = false;
    if (sessionIdRef.current) void flush({ completed: true });
  }, [enabled, flush]);

  return { onPlay, onTimeUpdate, onPause, onEnded };
}
