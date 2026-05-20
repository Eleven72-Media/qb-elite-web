import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { tierDisplayName } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

/**
 * Top bar shown on every authenticated screen.
 * Mobile keeps it minimal (logo + avatar); desktop expands to include
 * a horizontal nav rail. The TabBar at the bottom handles mobile nav.
 */
export function TopBar({
  displayName,
  tier,
  avatarUrl,
}: {
  displayName: string | null;
  tier: SubscriptionTier;
  avatarUrl: string | null;
}) {
  const initials = (displayName ?? "QB").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link
          href="/home"
          className="text-base font-extrabold uppercase tracking-tight"
        >
          QB Elite
        </Link>
        <nav className="hidden gap-1 md:flex">
          <DesktopLink href="/home">Home</DesktopLink>
          <DesktopLink href="/weight-room">Weight Room</DesktopLink>
          <DesktopLink href="/classroom">Classroom</DesktopLink>
          <DesktopLink href="/nutrition">Nutrition</DesktopLink>
          <DesktopLink href="/huddle">Huddle</DesktopLink>
        </nav>
        <Link href="/profile" className="flex items-center gap-2">
          {tier !== "free" && (
            <Badge variant="outline" className="border-primary/40 text-primary">
              {tierDisplayName(tier)}
            </Badge>
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName ?? "Profile"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}

function DesktopLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  );
}
