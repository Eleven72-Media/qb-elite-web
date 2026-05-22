import { Bell } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";

/**
 * Top bar that mirrors Flutter's HomeAppBar:
 *   [avatar(50)] [Hi, name (red bold) / "Welcome to quarterback experience"]   [bell-with-badge]
 *
 * Avatar tap → /profile (Flutter taps avatar → menuScreen which is profile).
 * Bell tap → /profile/notifications. Red dot when unread > 0.
 *
 * Renders on every authenticated page. Hidden on the auth screens
 * because (auth) routes use their own layout.
 */
export async function TopBar({
  displayName,
  avatarUrl,
}: {
  displayName: string | null;
  avatarUrl: string | null;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadCount = 0;
  if (user) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null);
    unreadCount = count ?? 0;
  }

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
          <Link
            href="/profile/notifications"
            aria-label="Notifications"
            className="relative -m-2 inline-flex h-10 w-10 items-center justify-center rounded-full"
          >
            <Bell className="h-[22px] w-[22px] text-foreground" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 inline-block h-2 w-2 rounded-full bg-[#E50000] ring-2 ring-white" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
