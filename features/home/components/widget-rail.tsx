import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { resolveRedirect } from "@/lib/redirect";

import type { HomeWidget } from "../queries";

/**
 * Vertical stack of admin-curated home widgets — image + headline + CTA.
 * Server-rendered: data is fetched in the page and passed in, no client
 * state needed.
 */
export function WidgetRail({ widgets }: { widgets: HomeWidget[] }) {
  if (widgets.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {widgets.map((widget) => (
        <WidgetCard key={widget.id} widget={widget} />
      ))}
    </div>
  );
}

function WidgetCard({ widget }: { widget: HomeWidget }) {
  const redirect = resolveRedirect(widget.redirectUrl);
  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {widget.imageUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-foreground/5">
          <Image
            src={widget.imageUrl}
            alt={widget.title ?? ""}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {widget.title && (
          <h3 className="text-base font-bold uppercase tracking-tight">
            {widget.title}
          </h3>
        )}
        {widget.subtitle && (
          <p className="text-sm text-muted-foreground">{widget.subtitle}</p>
        )}
        {widget.ctaText && (
          <Button size="sm" className="mt-auto w-fit" variant="secondary">
            {widget.ctaText}
          </Button>
        )}
      </div>
    </article>
  );

  if (redirect.kind === "external") {
    return (
      <a href={redirect.href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  if (redirect.kind === "internal") {
    return <Link href={redirect.href}>{inner}</Link>;
  }
  return inner;
}
