"use client";

import { useEffect, useRef, useState } from "react";

/**
 * In-app splash overlay that plays the same hero video the native
 * Flutter SplashScreen does, so the PWA opens with the matching brand
 * moment users see on iOS. The overlay:
 *
 * - Holds at minimum 1.6s so a fast network doesn't flash it
 * - Dismisses on video `ended` (with a hard 3s ceiling as a fallback
 *   in case autoplay is blocked or the file fails to decode)
 * - Fades out over 350ms
 * - Only fires once per session (sessionStorage-gated) so route
 *   changes don't re-trigger it
 *
 * Video is muted + playsInline + autoplay so iOS Safari actually plays
 * it without a tap.
 */
const VIDEO_SRC = "/hero-qbapp.mp4";
const MIN_HOLD_MS = 1600;
const MAX_HOLD_MS = 3000;
const FADE_MS = 350;

export function SplashOverlay() {
  const [shown, setShown] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("qbe-splash-shown") === "1") return;
    window.sessionStorage.setItem("qbe-splash-shown", "1");
    setShown(true);
    startedAtRef.current = Date.now();

    const maxTimer = window.setTimeout(beginFade, MAX_HOLD_MS);
    return () => window.clearTimeout(maxTimer);
    // beginFade is stable enough — recapturing isn't needed because we
    // only mount once per session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function beginFade() {
    const elapsed = Date.now() - startedAtRef.current;
    const wait = Math.max(0, MIN_HOLD_MS - elapsed);
    window.setTimeout(() => {
      setFading(true);
      window.setTimeout(() => setShown(false), FADE_MS);
    }, wait);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // iOS sometimes resolves play() with a NotAllowedError if autoplay
    // is restricted — fall back to the MAX_HOLD_MS timer dismiss.
    v.play().catch(() => {
      /* silent — timer-based dismiss handles us */
    });
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={beginFade}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
