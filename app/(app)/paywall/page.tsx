import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PaywallClient } from "./paywall-client";
import { PaywallPausedNotice } from "./paywall-paused-notice";

export const metadata = { title: "Start your free trial — QB Elite" };
export const dynamic = "force-dynamic";

export default async function PaywallPage({
  searchParams,
}: {
  searchParams: { canceled?: string };
}) {
  // Subscription pivot 2026-07: paywall replaced with a "we're rebuilding"
  // notice. Flip NEXT_PUBLIC_SUBSCRIPTIONS_PAUSED off in Vercel to restore.
  if (process.env.NEXT_PUBLIC_SUBSCRIPTIONS_PAUSED === "true") {
    return <PaywallPausedNotice />;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/paywall");

  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_source")
    .eq("id", user.id)
    .maybeSingle();
  const profile = data as {
    subscription_tier: string | null;
    subscription_source: string | null;
  } | null;

  return (
    <PaywallClient
      currentTier={profile?.subscription_tier ?? "free"}
      currentSource={profile?.subscription_source ?? null}
      canceled={searchParams.canceled === "1"}
    />
  );
}
