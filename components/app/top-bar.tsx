import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { NotificationBell } from "./notification-bell";

/**
 * Top bar that mirrors Flutter's HomeAppBar:
 *   [avatar(50)] [Hi, name (red bold) / "Welcome to quarterback experience"]   [bell]
 *
 * Avatar tap → /profile. Bell tap → /profile/notifications.
 *
 * Pure server component: no Supabase round-trip. Layout passes name +
 * avatar already, and the unread badge defers to a client component so
 * the bar renders in the same micro-task as the page shell.
 */
export function TopBar({
  displayName,
  avatarUrl,
}: {
  displayName: string | null;
  avatarUrl: string | null;
}) {
  const initials = (displayName ?? "QB").slice(0, 2).toUpperCase();
  const firstName = (displayName ?? "Athlete").split(" ")[0];

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="px-4 pb-3 pt-[max(env(safe-area-inset-top),0.25rem)] md:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] items-start gap-3">
          <Link
            href="/profile"
            aria-label="Profile"
            className="shrink-0 active:opacity-80"
          >
            <Avatar className="h-[50px] w-[50px]">
              <AvatarImage src={avatarUrl ?? undefined} alt={displayName ?? "Profile"} />
              <AvatarFallback className="bg-primary/15 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link href="/profile" className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-primary">
              Hi, {firstName}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              Welcome to quarterback experience
            </p>
          </Link>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
