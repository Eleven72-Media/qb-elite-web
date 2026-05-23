"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Notification bell — defers the unread count query to client-side so
 * the server-rendered top bar doesn't block on it on every navigation.
 * The bell renders instantly (count is 0 until the fetch returns).
 */
export function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("read_at", null);
      if (!cancelled) setUnread(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href="/profile/notifications"
      aria-label="Notifications"
      className="relative -m-2 inline-flex h-10 w-10 items-center justify-center rounded-full"
    >
      <Bell className="h-[22px] w-[22px] text-foreground" strokeWidth={1.75} />
      {unread > 0 && (
        <span className="absolute right-1.5 top-1.5 inline-block h-2 w-2 rounded-full bg-[#E50000] ring-2 ring-white" />
      )}
    </Link>
  );
}
