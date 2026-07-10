"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { track } from "@/lib/analytics";

// Fires checkout_completed once when the user lands on /home with
// ?welcome=1 (the success_url from /api/stripe/checkout). Client-side
// only — the source of truth for "paid" is still the Stripe webhook.
export function CheckoutSuccessTrack() {
  const params = useSearchParams();
  const welcome = params.get("welcome");
  const session = params.get("session");

  useEffect(() => {
    if (welcome !== "1") return;
    track("checkout_completed", { sessionId: session ?? "unknown" });
  }, [welcome, session]);

  return null;
}
