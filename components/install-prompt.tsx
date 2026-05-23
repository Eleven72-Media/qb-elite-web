"use client";

import { Share, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const DISMISS_KEY = "qbe-install-dismissed-at";
const DISMISS_TTL_DAYS = 14;

// Chrome's BeforeInstallPromptEvent isn't in stock DOM lib types.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const at = Number(raw);
  if (!Number.isFinite(at)) return false;
  const ageDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
  return ageDays < DISMISS_TTL_DAYS;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  const navAny = window.navigator as Navigator & { standalone?: boolean };
  if (navAny.standalone) return true;
  return window.matchMedia?.("(display-mode: standalone)").matches ?? false;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  // iPadOS 13+ reports as Mac; check touch points to disambiguate.
  const isIpad =
    /macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/.test(ua) || isIpad;
}

export function InstallPrompt() {
  const [mode, setMode] = useState<"hidden" | "ios" | "android">("hidden");
  const [deferred, setDeferred] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    if (isIos()) {
      // Show after a short delay so it doesn't slam the user on first paint.
      const t = window.setTimeout(() => setMode("ios"), 1500);
      return () => window.clearTimeout(t);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setMode("hidden");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  }

  if (mode === "hidden") return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 mx-auto max-w-md px-4 md:bottom-6">
      <div className="relative rounded-3xl bg-white p-4 pr-10 shadow-[0_12px_32px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          Install QB Elite
        </p>
        {mode === "ios" ? (
          <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-foreground/85">
            Tap <Share className="inline h-4 w-4 text-primary" /> in Safari, then{" "}
            <span className="font-semibold">Add to Home Screen</span> for the
            full app experience.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-foreground/85">
              Install for fullscreen mode and faster launches.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={install} className="rounded-full">
                Install
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={dismiss}
                className="rounded-full"
              >
                Not now
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
