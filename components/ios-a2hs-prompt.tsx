"use client";

import { Share, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * iOS Safari "Add to Home Screen" coaching prompt.
 *
 * iOS Safari does not fire `beforeinstallprompt`, so the only way a
 * user can install the PWA there is via the Share sheet → "Add to
 * Home Screen". They won't discover that on their own. This component
 * detects the case (iOS + Safari + not already standalone) and shows a
 * one-time bottom sheet teaching the flow.
 *
 * Snoozes for 7 days when dismissed (localStorage) so we don't nag
 * returning visitors. Auto-hides if the user installs (page re-opens
 * in standalone mode → component returns null on next mount).
 *
 * Mount this once near the top of the marketing page + once on the
 * authenticated home so we catch both prospects and existing accounts
 * who signed in via web without installing.
 */
const STORAGE_KEY = "qbe-a2hs-dismissed-at";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const REVEAL_DELAY_MS = 2500; // let the page paint first

export function IosA2HSPrompt() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isIosSafari() || isStandalone()) return;
    const dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < SNOOZE_MS) return;
    const t = window.setTimeout(() => setVisible(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    setClosing(true);
    window.setTimeout(() => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
      setVisible(false);
    }, 220);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop catches taps outside the sheet to dismiss. */}
      <div
        aria-hidden
        onClick={dismiss}
        className={`fixed inset-0 z-[90] bg-black/30 transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Install QB Elite on your iPhone"
        className={`fixed inset-x-0 bottom-0 z-[91] mx-auto w-full max-w-[480px] rounded-t-3xl bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5 shadow-[0_-12px_30px_rgba(0,0,0,0.18)] transition-transform duration-200 ${
          closing ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />

        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Install on iPhone
            </p>
            <h2 className="mt-0.5 text-[17px] font-extrabold tracking-tight">
              Add QB Elite to your Home Screen
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground active:bg-muted"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          Get the full-screen app experience — no App Store needed.
        </p>

        <ol className="mt-4 space-y-2.5">
          <Step
            n={1}
            label={
              <>
                Tap{" "}
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold">
                  <Share className="h-3.5 w-3.5" strokeWidth={2} />
                  Share
                </span>{" "}
                in the Safari toolbar
              </>
            }
          />
          <Step n={2} label='Scroll and tap "Add to Home Screen"' />
          <Step n={3} label='Tap "Add" — QB Elite lands on your Home Screen' />
        </ol>

        <button
          type="button"
          onClick={dismiss}
          className="mt-5 w-full rounded-full bg-foreground/[0.06] py-3 text-[14px] font-semibold text-foreground/75 active:bg-foreground/[0.10]"
        >
          Got it
        </button>
      </div>
    </>
  );
}

function Step({ n, label }: { n: number; label: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
        {n}
      </span>
      <span className="pt-0.5 text-sm leading-snug text-foreground/85">
        {label}
      </span>
    </li>
  );
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as Mac with touch — catch via touch + Safari combo.
    (ua.includes("Macintosh") && "ontouchend" in document);
  if (!isIos) return false;
  // Exclude in-app browsers (Chrome iOS, Firefox iOS, Instagram, etc.) —
  // those don't expose Add to Home Screen.
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|FBAN|FBAV|Instagram|LinkedInApp|Twitter|GSA/.test(
    ua,
  );
  return !isOtherBrowser;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS uses navigator.standalone; rest of the world uses display-mode.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iosStandalone = (window.navigator as any).standalone === true;
  const mq = window.matchMedia?.("(display-mode: standalone)").matches;
  return Boolean(iosStandalone || mq);
}
