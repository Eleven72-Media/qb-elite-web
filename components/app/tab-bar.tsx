"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Bottom navigation — mirrors Flutter shell_scaffold.dart exactly:
 * Home / Classroom / Nutrition / Weight room, in that order. Profile
 * is reached by tapping the avatar in the top bar (Flutter does the
 * same — no Profile tab).
 */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="flex h-[68px] items-stretch justify-around px-1">
        <Tab
          href="/home"
          label="Home"
          active={pathname.startsWith("/home")}
          icon={<HomeIcon />}
          activeIcon={<HomeIconFilled />}
        />
        <Tab
          href="/classroom"
          label="Classroom"
          active={pathname.startsWith("/classroom")}
          icon={<SchoolIcon />}
          activeIcon={<SchoolIconFilled />}
        />
        <Tab
          href="/nutrition"
          label="Nutrition"
          active={pathname.startsWith("/nutrition")}
          icon={<FoodIcon />}
          activeIcon={<FoodIconFilled />}
        />
        <Tab
          href="/weight-room"
          label="Weight room"
          active={pathname.startsWith("/weight-room")}
          icon={<WeightsIcon />}
          activeIcon={<WeightsIconFilled />}
        />
      </ul>
    </nav>
  );
}

function Tab({
  href,
  label,
  active,
  icon,
  activeIcon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}) {
  return (
    <li className="flex flex-1">
      <Link
        href={href}
        className="flex w-full flex-col items-center justify-center gap-1 transition-colors"
      >
        <span
          className={cn(
            "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
            active && "bg-primary/10"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center",
              active ? "text-primary" : "text-foreground/70"
            )}
          >
            {active ? activeIcon : icon}
          </span>
        </span>
        <span
          className={cn(
            "text-[11px] leading-none",
            active
              ? "font-bold text-primary"
              : "font-medium text-foreground/70"
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

/* Custom inline SVG icons that match the Fluent / healthicons styles
   used in the Flutter app. Outline variants for inactive, filled for
   active. Kept inline (no extra asset round-trips). */

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
function HomeIconFilled() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.3 2.26a1 1 0 0 1 1.4 0l9 8.18a1 1 0 0 1-.67 1.74H20v8.32a1.5 1.5 0 0 1-1.5 1.5H14v-6h-4v6H5.5A1.5 1.5 0 0 1 4 20.5v-8.32H2.97a1 1 0 0 1-.67-1.74l9-8.18Z" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 5l9 4.5L12 14 3 9.5Z" />
      <path d="M7 12v4.5c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5V12" />
      <path d="M21 9.5V14" />
    </svg>
  );
}
function SchoolIconFilled() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.55 4.13a1 1 0 0 1 .9 0l9 4.5a1 1 0 0 1 0 1.79l-1.45.72V14a.75.75 0 0 1-1.5 0v-2.1l-1 .5v4.1c0 1.78-3.36 3-5.5 3s-5.5-1.22-5.5-3v-4.1l-3.95-1.98a1 1 0 0 1 0-1.79l9-4.5Z" />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4.5 0 8 3.6 8 8 0 5-3.5 9-8 9s-8-4-8-9c0-4.4 3.5-8 8-8Z" />
      <path d="M9 9c1.5-1 4.5-1 6 0" />
    </svg>
  );
}
function FoodIconFilled() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5c-4.92 0-8.75 3.92-8.75 8.75 0 5.4 3.83 9.75 8.75 9.75s8.75-4.35 8.75-9.75c0-4.83-3.83-8.75-8.75-8.75Zm-3.45 7.18c1.83-1.22 5.07-1.22 6.9 0a.75.75 0 1 1-.83 1.25c-1.34-.9-3.9-.9-5.24 0a.75.75 0 1 1-.83-1.25Z" />
    </svg>
  );
}

function WeightsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9v6" />
      <path d="M5 7v10" />
      <path d="M7 10h10" />
      <path d="M7 14h10" />
      <path d="M19 7v10" />
      <path d="M21 9v6" />
    </svg>
  );
}
function WeightsIconFilled() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2.5" y="9" width="1.8" height="6" rx="0.6" />
      <rect x="4.5" y="7" width="2.4" height="10" rx="0.8" />
      <rect x="6.8" y="10.5" width="10.4" height="3" rx="0.6" />
      <rect x="17.1" y="7" width="2.4" height="10" rx="0.8" />
      <rect x="19.7" y="9" width="1.8" height="6" rx="0.6" />
    </svg>
  );
}
