import { redirect } from "next/navigation";

import { TabBar } from "@/components/app/tab-bar";
import { TopBar } from "@/components/app/top-bar";
import { InstallPrompt } from "@/components/install-prompt";
import { createClient } from "@/lib/supabase/server";

/**
 * Authenticated app shell. Middleware already gates this route group,
 * but we double-check on the server here so we have a Profile to pass
 * down to the header (display_name, tier badge, etc.) without an extra
 * client-side fetch.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, role, subscription_tier, birth_date, avatar_url"
    )
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        displayName={profile?.display_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
      <TabBar />
      <InstallPrompt />
    </div>
  );
}
