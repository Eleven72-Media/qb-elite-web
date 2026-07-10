"use client";

import { track as vercelTrack } from "@vercel/analytics/react";

// Discrete event names — keep this enum tight so the Vercel Analytics
// dashboard doesn't fragment into 100 one-off events. If you need a new
// funnel event, add it here first.
export type FunnelEvent =
  | "signup_started"
  | "signup_completed"
  | "login_completed"
  | "paywall_viewed"
  | "checkout_started"
  | "checkout_completed"
  | "subscription_canceled"
  | "video_played"
  | "video_completed";

type EventProps = Record<string, string | number | boolean | null>;

// Thin wrapper around Vercel Analytics' track() so callers don't depend on
// the SDK directly — makes it cheap to swap analytics providers later.
export function track(event: FunnelEvent, props?: EventProps): void {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics failures must never break the user flow.
  }
}
