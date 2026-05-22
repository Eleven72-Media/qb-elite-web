import Image from "next/image";
import Link from "next/link";

import { resolveRedirect } from "@/lib/redirect";
import { cn } from "@/lib/utils";

import type { HomeWidget } from "../queries";

/**
 * "Daily Grind" stack — image-as-background cards (180px tall, 20px
 * radius) with a dark gradient overlay, white title + subtitle, and a
 * primary-red pill CTA on the right. Matches Flutter's _buildHomeWidgetCard.
 */
export function WidgetRail({
  widgets,
  lockedRedirectUrls = [],
}: {
  widgets: HomeWidget[];
  lockedRedirectUrls?: string[];
}) {
  if (widgets.length === 0) return null;
  const lockedSet = new Set(lockedRedirectUrls);
  return (
    <div className="space-y-5">
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          locked={!!widget.redirectUrl && lockedSet.has(widget.redirectUrl)}
        />
      ))}
    </div>
  );
}

function WidgetCard({
  widget,
  locked,
}: {
  widget: HomeWidget;
  locked: boolean;
}) {
  const redirect = resolveRedirect(widget.redirectUrl);

  const inner = (
    <article
      className={cn(
        "relative h-[180px] w-full overflow-hidden rounded-[20px] bg-foreground/5 shadow-md",
        "transition-transform active:scale-[0.99]"
      )}
    >
      {widget.imageUrl ? (
        <Image
          src={widget.imageUrl}
          alt={widget.title ?? ""}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 600px, 100vw"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/5" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
      {locked && (
        <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-3">
        <div className="flex min-w-0 flex-1 items-end gap-3">
          <div className="min-w-0 flex-1">
            {widget.title && (
              <p className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md">
                {widget.title}
              </p>
            )}
            {widget.subtitle && (
              <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-white/90 drop-shadow-md">
                {widget.subtitle}
              </p>
            )}
          </div>
          {widget.ctaText && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow">
              {widget.ctaText}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (redirect.kind === "external") {
    return (
      <a href={redirect.href} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }
  if (redirect.kind === "internal") {
    return (
      <Link href={redirect.href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
