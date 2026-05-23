import { Bell, BellRing } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Notifications — QB Elite" };
export const dynamic = "force-dynamic";

interface NotificationRow {
  id: string;
  title: string | null;
  body: string | null;
  type: string | null;
  read: boolean | null;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default async function NotificationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, type, read, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as NotificationRow[];

  return (
    <>
      <PageHeader title="Notifications" backHref="/profile" />
      <div className="mx-auto w-full max-w-[640px] px-5 pb-6 md:px-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center pt-16 text-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-10 w-10 text-primary/60" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-[20px] font-bold">You&apos;re all caught up</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll let you know when something new drops.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((n) => {
              const unread = !n.read;
              return (
                <li
                  key={n.id}
                  className={`flex gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${
                    unread ? "ring-2 ring-primary/30" : "ring-1 ring-black/5"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      unread
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {unread ? (
                      <BellRing className="h-5 w-5" strokeWidth={1.75} />
                    ) : (
                      <Bell className="h-5 w-5" strokeWidth={1.75} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="flex-1 text-[14px] font-bold leading-tight">
                        {n.title ?? "Notification"}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    {n.body && (
                      <p className="mt-1 text-[13px] text-foreground/80">
                        {n.body}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
