import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { tierDisplayName } from "@/lib/tier";

import { SignOutButton } from "./sign-out-button";

export const metadata = { title: "Profile — QB Elite" };

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email, subscription_tier, subscription_source")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="container max-w-xl py-8">
      <h1 className="mb-6 text-3xl font-extrabold uppercase tracking-tight">
        Profile
      </h1>
      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <Row label="Name" value={profile?.display_name ?? "—"} />
        <Row label="Email" value={profile?.email ?? user.email ?? "—"} />
        <Row label="Tier" value={tierDisplayName(profile?.subscription_tier ?? "free")} />
        <Row
          label="Billed via"
          value={
            profile?.subscription_source
              ? profile.subscription_source.toUpperCase()
              : "—"
          }
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link href="/profile/edit">
          <Button variant="outline" className="w-full">
            Edit profile
          </Button>
        </Link>
        <Link href="/profile/notifications">
          <Button variant="outline" className="w-full">
            Notifications
          </Button>
        </Link>
        <Button variant="outline" disabled>
          Manage subscription (Sprint 4)
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-right text-sm">{value}</div>
    </div>
  );
}
