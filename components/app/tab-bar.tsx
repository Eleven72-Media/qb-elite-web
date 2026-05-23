"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Bottom navigation — mirrors Flutter shell_scaffold.dart exactly:
 * Home / Classroom / Nutrition / Weight room. Icons are the exact same
 * Fluent / healthicons SVGs the native app uses (rendered via CSS mask
 * so they pick up currentColor for the selected/unselected state).
 *
 * Profile is reached by tapping the avatar in the top bar — Flutter does
 * the same (no Profile tab).
 */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white pb-[calc(env(safe-area-inset-bottom)+1rem)] md:hidden">
      <ul className="flex items-stretch justify-around px-1 pt-3">
        <Tab
          href="/home"
          label="Home"
          active={pathname.startsWith("/home")}
          iconSize={22}
          icon="/icons/nav/fluent--home-12-regular.svg"
          activeIcon="/icons/nav/fluent--home-12-filled.svg"
        />
        <Tab
          href="/classroom"
          label="Classroom"
          active={pathname.startsWith("/classroom")}
          iconSize={22}
          icon="/icons/nav/school-outline.svg"
          activeIcon="/icons/nav/school.svg"
        />
        <Tab
          href="/nutrition"
          label="Nutrition"
          active={pathname.startsWith("/nutrition")}
          iconSize={22}
          icon="/icons/nav/fluent--food-16-regular.svg"
          activeIcon="/icons/nav/fluent--food-16-filled.svg"
        />
        <Tab
          href="/weight-room"
          label="Weight room"
          active={pathname.startsWith("/weight-room")}
          iconSize={28}
          icon="/icons/nav/healthicons--weights-outline.svg"
          activeIcon="/icons/nav/healthicons--weights.svg"
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
  iconSize,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  activeIcon: string;
  iconSize: number;
}) {
  return (
    <li className="flex flex-1">
      <Link
        href={href}
        className="flex h-14 w-full flex-col items-center justify-center gap-0.5"
      >
        <span
          className={cn(
            "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
            active && "bg-primary/10"
          )}
        >
          <span
            aria-hidden
            className={cn(
              "block bg-current",
              active ? "text-primary" : "text-foreground/70"
            )}
            style={{
              width: iconSize,
              height: iconSize,
              maskImage: `url(${active ? activeIcon : icon})`,
              WebkitMaskImage: `url(${active ? activeIcon : icon})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
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
