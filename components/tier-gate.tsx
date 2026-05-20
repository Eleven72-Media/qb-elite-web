import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { tierDisplayName, tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

/**
 * Server component that hides children behind a tier check. RLS is the
 * actual gate (server-side enforced); this is purely a UX flourish so
 * locked features tease the upsell without leaking the underlying data.
 *
 * Usage:
 *   <TierGate require="legend">
 *     <FilmStudyRail huddles={...} />
 *   </TierGate>
 */
export async function TierGate({
  require,
  children,
  fallback,
}: {
  require: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return fallback ?? <LockedFallback require={require} />;
  }
  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = (data as { subscription_tier: SubscriptionTier } | null)
    ?.subscription_tier;
  if (!tierSatisfies(tier, require)) {
    return fallback ?? <LockedFallback require={require} />;
  }
  return <>{children}</>;
}

function LockedFallback({ require }: { require: SubscriptionTier }) {
  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
      <Lock className="mx-auto mb-3 h-6 w-6 text-primary" />
      <h2 className="text-lg font-extrabold uppercase tracking-tight">
        {tierDisplayName(require)} feature
      </h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">
        Start your 7-day free trial to unlock this.
      </p>
      <Link href="/paywall">
        <Button>Unlock</Button>
      </Link>
    </section>
  );
}
