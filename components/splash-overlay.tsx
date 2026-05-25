"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * In-app splash overlay matching the native Flutter SplashScreen:
 *
 * - Hero video loops behind a dark vertical gradient
 * - Logo + "#becomeelite" pill + headline + supporting tagline
 *   stagger-fade in (mirrors flutter_animate timing in
 *   qb_elite_source/lib/src/features/splash/screens/splash_screen.dart)
 * - Loading pulse bar at the bottom
 *
 * Holds at minimum 1.6s so a fast network doesn't flash it, hard
 * ceiling of 3s in case autoplay is blocked, fades over 350ms, and
 * only fires once per session (sessionStorage-gated).
 */
const VIDEO_SRC = "/hero-qbapp.mp4";
const MIN_HOLD_MS = 5000;
const MAX_HOLD_MS = 6500;
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
    v.play().catch(() => {
      /* iOS may block autoplay — timer-based dismiss handles us */
    });
  }, [shown]);

  if (!shown) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity ${
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
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Top → middle → bottom darkening so the white type stays
          readable over whatever frame of the video is showing. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Logo — top ~12% */}
      <div className="splash-logo absolute left-0 right-0 flex justify-center" style={{ top: "12vh" }}>
        <div
          className="flex h-[138px] w-[138px] items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
          }}
        >
          <Image
            src="/logo.png"
            alt=""
            width={110}
            height={110}
            priority
            className="h-[110px] w-auto object-contain"
          />
        </div>
      </div>

      {/* Copy block — bottom ~12% */}
      <div
        className="absolute left-6 right-6 flex flex-col items-center text-center text-white"
        style={{ bottom: "12vh" }}
      >
        <span
          className="splash-pill inline-block rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: "rgba(182, 31, 38, 0.18)",
            borderColor: "rgba(182, 31, 38, 0.55)",
          }}
        >
          #becomeelite
        </span>

        <h1
          className="splash-headline mt-3.5 text-[15px] font-bold uppercase leading-tight tracking-[0.06em]"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
        >
          THE MOST COMPREHENSIVE
          <br />
          QB TRAINING MOBILE APP
        </h1>

        <p
          className="splash-tagline mt-3 text-[13px] font-medium leading-[1.5]"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          Train Like a Pro. Lead Like a Champion.
          <br />
          Play with Confidence.
        </p>
      </div>

      {/* Loading pulse */}
      <div className="splash-pulse absolute left-1/2 -translate-x-1/2" style={{ bottom: 28 }}>
        <span className="block h-1 w-12 overflow-hidden rounded-full bg-white/25">
          <span className="block h-full w-1/3 animate-[splash-pulse_1.2s_ease-in-out_infinite] rounded-full bg-white" />
        </span>
      </div>

      <style jsx>{`
        @keyframes splash-fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes splash-fade-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splash-pulse {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(350%);
          }
        }
        .splash-logo {
          animation: splash-fade-in 0.7s ease-out both;
        }
        .splash-pill {
          opacity: 0;
          animation: splash-fade-up 0.5s ease-out 0.4s forwards;
        }
        .splash-headline {
          opacity: 0;
          animation: splash-fade-up 0.6s ease-out 0.6s forwards;
        }
        .splash-tagline {
          opacity: 0;
          animation: splash-fade-up 0.6s ease-out 0.9s forwards;
        }
        .splash-pulse {
          opacity: 0;
          animation: splash-fade-up 0.5s ease-out 1.2s forwards;
        }
      `}</style>
    </div>
  );
}
