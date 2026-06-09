import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Top-level marketing site nav. Sticky/fixed so it follows the user
 * down the page. Each item links to its own sub-page under /preview
 * (matching Justin's brief: no dropdowns, single click → page).
 */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "QB Academy", href: "/preview/qb-academy" },
  { label: "Camps", href: "/preview/camps" },
  { label: "App", href: "https://qbeliteapp.com" },
  { label: "Store", href: "/preview/store" },
  { label: "About Us", href: "/preview/about" },
];

export function FloatingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-navyDeep/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 md:px-10">
        <Link href="/preview" className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 p-1.5 ring-1 ring-white/20">
            <Image
              src="/logo.png"
              alt="QB Elite"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="font-display text-xl uppercase tracking-[0.08em] text-white">
            QB Elite
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full bg-white/5 px-1.5 py-1.5 ring-1 ring-white/10 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/preview#contact" className="hidden sm:inline-flex">
          <Button
            size="sm"
            className="h-10 rounded-none bg-primary px-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-md hover:bg-primary/90"
          >
            Train With Us
          </Button>
        </Link>

        <Link
          href="/preview#contact"
          className="inline-flex items-center gap-1 bg-primary px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:hidden"
        >
          Menu
        </Link>
      </div>
    </header>
  );
}
