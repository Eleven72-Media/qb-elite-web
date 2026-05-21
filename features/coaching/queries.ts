import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Coaching: GOAT-tier 1-on-1 booking.
 *
 * Admin defines recurring weekly `coaching_availability` slots (e.g.
 * "Tuesdays 4-6 PM, 30-min slots"). Athletes request a session by
 * inserting a row into `coaching_sessions` with status='pending';
 * admin reviews + confirms via the admin panel.
 *
 * RLS: read on availability is open to authenticated users; writes on
 * coaching_sessions are gated to the caller's own user_id.
 */

export interface CoachingAvailability {
  id: string;
  dayOfWeek: number; // 0=Sunday..6=Saturday (JS convention)
  startTime: string; // "HH:MM" 24-hour
  endTime: string; // "HH:MM"
  sessionDuration: number; // minutes
  active: boolean;
}

export interface CoachingSession {
  id: string;
  userId: string;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  sessionDate: string; // ISO date
  startTime: string | null;
  endTime: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled" | string;
  notes: string | null;
  createdAt: string;
}

const mapAvailability = (db: any): CoachingAvailability => ({
  id: db.id,
  dayOfWeek: db.day_of_week,
  startTime: db.start_time,
  endTime: db.end_time,
  sessionDuration: db.session_duration ?? 30,
  active: db.active ?? true,
});

const mapSession = (db: any): CoachingSession => ({
  id: db.id,
  userId: db.user_id,
  clientName: db.client_name ?? null,
  clientEmail: db.client_email ?? null,
  clientPhone: db.client_phone ?? null,
  sessionDate: db.session_date,
  startTime: db.start_time ?? null,
  endTime: db.end_time ?? null,
  status: db.status ?? "pending",
  notes: db.notes ?? null,
  createdAt: db.created_at,
});

export async function getActiveAvailability(
  supabase: SupabaseClient
): Promise<CoachingAvailability[]> {
  const { data, error } = await supabase
    .from("coaching_availability")
    .select("*")
    .eq("active", true)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapAvailability);
}

export async function getUserUpcomingSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<CoachingSession[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("coaching_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("session_date", today)
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSession);
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function dayOfWeekLabel(d: number): string {
  return DAY_NAMES[d] ?? `Day ${d}`;
}

/** "16:00" → "4:00 PM" */
export function timeLabel(time24: string | null): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = mStr ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}
