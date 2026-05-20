import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Card shown when the user has no plans visible (typically free-tier
 * with no Week 0 preview authored, or RLS filtered everything out).
 * Mirrors the mobile paywall upsell on Weight Room home (F-002).
 */
export function PaywallCard() {
  return (
    <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/0 p-6 text-center">
      <h2 className="mb-2 text-xl font-extrabold uppercase tracking-tight">
        Unlock your weekly plan
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Start your 7-day free trial — full workout + meal plans, live
        Huddles, and 1-on-1 coaching options. No charge for the first week.
      </p>
      <Link href="/paywall">
        <Button size="lg">Start Free Trial</Button>
      </Link>
    </section>
  );
}
