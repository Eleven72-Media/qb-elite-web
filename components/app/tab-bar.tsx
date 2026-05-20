"use client";

import {
  Apple,
  Dumbbell,
  Home as HomeIcon,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Bottom tab bar — mobile only (hidden md+ via top-bar nav).
 *
 * Mirrors the Flutter app's tab order: Home / Weight Room / Classroom /
 * Nutrition / Huddle. Active state matches by path prefix so deep
 * routes (e.g. /weight-room/workout/123) still highlight the tab.
 */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:hidden">
      <ul className="container flex h-16 items-stretch justify-around">
        <Tab href="/home" label="Home" Icon={HomeIcon} active={pathname.startsWith("/home")} />
        <Tab
          href="/weight-room"
          label="Weight"
          Icon={Dumbbell}
          active={pathname.startsWith("/weight-room")}
        />
        <Tab
          href="/classroom"
          label="Classroom"
          Icon={GraduationCap}
          active={pathname.startsWith("/classroom")}
        />
        <Tab
          href="/nutrition"
          label="Nutrition"
          Icon={Apple}
          active={pathname.startsWith("/nutrition")}
        />
        <Tab
          href="/huddle"
          label="Huddle"
          Icon={Users}
          active={pathname.startsWith("/huddle")}
        />
      </ul>
    </nav>
  );
}

function Tab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <li className="flex flex-1">
      <Link
        href={href}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider transition-colors",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    </li>
  );
}
