"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * In-app splash overlay that mirrors the native launch screen (white
 * background + centered logo) so the PWA opens with the same brand
 * moment users see on iOS. Holds for ~900ms then fades out, matching
 * the Flutter SplashScreen pause before navigation.
 *
 * Only fires once per session (sessionStorage-gated) so route changes
 * don't re-trigger it.
 */
export function SplashOverlay() {
  const [shown, setShown] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("qbe-splash-shown") === "1") return;
    window.sessionStorage.setItem("qbe-splash-shown", "1");
    setShown(true);

    const fadeAt = window.setTimeout(() => setFading(true), 900);
    const removeAt = window.setTimeout(() => setShown(false), 1400);
    return () => {
      window.clearTimeout(fadeAt);
      window.clearTimeout(removeAt);
    };
  }, []);

  if (!shown) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt=""
          width={140}
          height={140}
          priority
          className="h-[140px] w-[140px] object-contain"
        />
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
          #becomeelite
        </span>
      </div>
    </div>
  );
}
