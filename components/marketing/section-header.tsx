import type { ReactNode } from "react";

export function SectionHeader({
  number,
  eyebrow,
  title,
  subhead,
  surface = "dark",
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  subhead?: string;
  /** Sets the foreground palette. "dark" = white text on navy/graphite
   *  bg; "light" = navy text on white bg. Cards inside the section
   *  should pick their own colors to match. */
  surface?: "dark" | "light";
}) {
  const onLight = surface === "light";
  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
      <div className="flex items-start gap-5">
        <span
          className={`font-display text-[60px] leading-none md:text-[84px] ${
            onLight ? "text-brand-navy/15" : "text-white/15"
          }`}
        >
          {number}
        </span>
        <span className="mt-2 h-px w-16 bg-primary md:mt-4 md:w-20" />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h2
          className={`mt-4 font-display text-[40px] uppercase leading-[1.02] tracking-tight md:text-[64px] lg:text-[80px] ${
            onLight ? "text-brand-navy" : "text-white"
          }`}
        >
          {title}
        </h2>
        {subhead && (
          <p
            className={`mt-5 max-w-[640px] text-base leading-relaxed md:text-lg ${
              onLight ? "text-foreground/70" : "text-white/65"
            }`}
          >
            {subhead}
          </p>
        )}
      </div>
    </div>
  );
}

export function DashedDivider({
  position,
  tone = "light",
}: {
  position: "top" | "bottom";
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } h-px`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${
          tone === "light" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"
        } 0 8px, transparent 8px 16px)`,
      }}
    />
  );
}
