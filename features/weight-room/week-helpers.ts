import type { DayOfRelease, WorkoutPlanDay } from "./queries";

/**
 * Returns the 7 dates of the user's current calendar week (Mon-Sun).
 * Local time, so a user in PST and one in EST may see different
 * "current" weeks if they cross midnight. Matches mobile behavior.
 */
export function currentWeekDates(now = new Date()): Date[] {
  return dateWindow(now, 7);
}

/**
 * Returns `count` consecutive dates beginning at this week's Monday,
 * used by the Weight Room horizontally-scrollable strip so the user
 * can preview future weeks. Default 28 days (4 weeks ahead).
 */
export function dateWindow(now = new Date(), count = 28): Date[] {
  const day = now.getDay(); // 0 = Sun, 1 = Mon, … 6 = Sat
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + offsetToMonday);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAYS: DayOfRelease[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/** Maps a JS Date to the corresponding `day_of_release` enum string. */
export function dateToDayOfRelease(d: Date): DayOfRelease {
  const idx = d.getDay() === 0 ? 6 : d.getDay() - 1; // Mon = 0, … Sun = 6
  return DAYS[idx];
}

export function shortDayLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function dayOfMonthLabel(d: Date): string {
  return d.getDate().toString();
}

/** "May 20" — used as a section header above the workout. */
export function longDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Match a calendar date to its workout day, if any. */
export function matchDay(
  date: Date,
  days: WorkoutPlanDay[]
): WorkoutPlanDay | null {
  const target = dateToDayOfRelease(date);
  return days.find((d) => d.dayOfRelease === target) ?? null;
}

/** yyyy-mm-dd for URL params + storage. */
export function isoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
