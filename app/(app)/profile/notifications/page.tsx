import { Badge } from "@/components/ui/badge";
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

export default async function NotificationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, type, read, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as NotificationRow[];

  return (
    <div className="container max-w-2xl py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">
          Notifications
        </h1>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          You&apos;re all caught up.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((n) => (
            <li
              key={n.id}
              className={
                "rounded-xl border bg-card p-4 shadow-sm " +
                (n.read ? "" : "border-primary/40")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {n.title ?? "Notification"}
                  </p>
                  {n.body && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <Badge className="shrink-0 bg-primary/15 text-primary hover:bg-primary/15">
                    New
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
