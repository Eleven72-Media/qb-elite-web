"use client";

import { Calendar, Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * "+ Add" affordance on a training-video tile that schedules the
 * workout for a chosen day. Tap the chip → opens a tiny date sheet
 * (today + next 13 days). Selecting a day inserts into
 * user_scheduled_exercises and bounces the user to /weight-room with
 * the chosen day pre-selected so they can see the new card immediately.
 */
export function ScheduleWorkoutButton({ workoutId }: { workoutId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const days = next14Days();

  function schedule(iso: string) {
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in.", variant: "destructive" });
        return;
      }
      // sort_order = unix-ms so new items sort after existing ones.
      const { error } = await supabase
        .from("user_scheduled_exercises")
        .insert({
          user_id: user.id,
          scheduled_date: iso,
          workout_id: workoutId,
          sort_order: Date.now() % 2_000_000_000,
        });
      if (error) {
        toast({
          title: "Couldn't schedule",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setOpen(false);
      toast({
        title: "Added to your day",
        description: prettyLabel(iso),
      });
      router.push(`/weight-room?day=${iso}`);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={pending}
        aria-label="Add to a day"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors active:bg-primary/20",
          pending && "opacity-60"
        )}
      >
        <Plus className="h-5 w-5" strokeWidth={2.25} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-3 md:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" strokeWidth={2.25} />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                Schedule
              </p>
            </div>
            <h2 className="mt-1 text-[18px] font-bold leading-tight">
              Add to a day
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick the day you&apos;d like to do this workout. You can stack
              multiple videos onto the same day.
            </p>
            <ul className="mt-4 max-h-[55vh] space-y-2 overflow-y-auto">
              {days.map((d) => (
                <li key={d.iso}>
                  <button
                    type="button"
                    onClick={() => schedule(d.iso)}
                    disabled={pending}
                    className="flex w-full items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-left active:bg-muted/70 disabled:opacity-70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-[12px] font-bold uppercase tracking-wide">
                        {d.short}
                      </span>
                    </span>
                    <div className="flex-1">
                      <p className="text-[14px] font-bold leading-tight">
                        {d.label}
                      </p>
                      {d.relative && (
                        <p className="text-[11px] text-muted-foreground">
                          {d.relative}
                        </p>
                      )}
                    </div>
                    {pending && (
                      <Check className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function next14Days(): Array<{
  iso: string;
  label: string;
  short: string;
  relative?: string;
}> {
  const out = [] as Array<{
    iso: string;
    label: string;
    short: string;
    relative?: string;
  }>;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: isoDate(d),
      label: d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      short: d
        .toLocaleDateString(undefined, { weekday: "short" })
        .slice(0, 2)
        .toUpperCase(),
      relative: i === 0 ? "Today" : i === 1 ? "Tomorrow" : undefined,
    });
  }
  return out;
}

function prettyLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
