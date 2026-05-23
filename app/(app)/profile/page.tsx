import {
  ChevronRight,
  Heart,
  Info,
  LifeBuoy,
  LogOut,
  Pencil,
  Share2,
  Users,
  Utensils,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { tierDisplayName } from "@/lib/tier";

import { LogoutCard } from "./logout-card";

export const metadata = { title: "Profile — QB Elite" };
export const dynamic = "force-dynamic";

function ageFromBirth(birth: string | null): number | null {
  if (!birth) return null;
  const d = new Date(birth);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 130 ? age : null;
}

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, email, subscription_tier, avatar_url, birth_date, height, weight, unit_system"
    )
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? "Athlete";
  const email = profile?.email ?? user.email ?? "—";
  const tier = profile?.subscription_tier ?? "free";
  const initials = displayName.slice(0, 2).toUpperCase();
  const age = ageFromBirth(profile?.birth_date ?? null);
  const metric = (profile?.unit_system ?? "imperial") === "metric";
  const heightLabel =
    profile?.height != null ? `${profile.height}${metric ? "cm" : "in"}` : "—";
  const weightLabel =
    profile?.weight != null ? `${profile.weight}${metric ? "kg" : "lbs"}` : "—";

  return (
    <>
      <PageHeader title="Profile" />
      <div className="mx-auto w-full max-w-[640px] space-y-4 px-5 pb-2 md:px-6">
        <section className="rounded-2xl bg-gradient-to-br from-[#EEE5EF]/40 to-[#C1A2C5]/30 p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-[50px] w-[50px]">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-foreground">
                {displayName}
              </p>
              <p className="truncate text-sm text-foreground/70">{email}</p>
              <Link
                href="/paywall"
                className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/70 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white"
              >
                <Crown className="h-3.5 w-3.5" strokeWidth={2.25} />
                {tierDisplayName(tier)}
              </Link>
            </div>
            <Link
              href="/profile/edit"
              aria-label="Edit profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 active:bg-black/5"
            >
              <Pencil className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </div>
        </section>

        <section className="flex items-stretch gap-3">
          <StatBox label="Age" value={age != null ? `${age}yrs` : "—"} />
          <StatBox label="Weight" value={weightLabel} />
          <StatBox label="Height" value={heightLabel} />
        </section>

        <div className="space-y-3 pt-2">
          <TileLink
            href="#share"
            icon={<Share2 className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Share QB Elite App"
          />
          <TileLink
            href="/profile/favorites"
            icon={<Heart className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Favorites"
            chevron
          />
          <TileLink
            href="/huddle"
            icon={<Users className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="The Huddle"
            chevron
          />
          <TileLink
            href="/nutrition"
            icon={<Utensils className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Meal Plan"
            chevron
          />
          <TileLink
            href="/profile/about"
            icon={<Info className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="About Us"
          />
          <TileLink
            href="mailto:jmiller@qbelite.com?subject=QB%20Elite%20-%20Support%20Request"
            icon={<LifeBuoy className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Support"
          />
          <TileLink
            href="/profile/notifications"
            icon={<LogOut className="h-5 w-5 text-primary rotate-180" strokeWidth={1.75} />}
            label="Notifications"
            chevron
          />
        </div>

        <div className="pt-6">
          <LogoutCard />
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-muted py-2.5">
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-sm text-foreground/70">{label}</p>
    </div>
  );
}

function TileLink({
  href,
  icon,
  label,
  chevron = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
}) {
  const isExternal = href.startsWith("mailto:") || href.startsWith("http");
  const inner = (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_10px_rgba(167,174,193,0.21)]">
      <span>{icon}</span>
      <span className="flex-1 text-base font-medium text-foreground">
        {label}
      </span>
      {chevron && (
        <ChevronRight className="h-4 w-4 text-foreground/40" strokeWidth={2} />
      )}
    </div>
  );
  if (isExternal) {
    return (
      <a href={href} className="block active:opacity-90">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block active:opacity-90">
      {inner}
    </Link>
  );
}
