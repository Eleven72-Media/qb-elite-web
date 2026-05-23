import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/**
 * Flutter-style page header — rounded-square back button on the left,
 * centered title, optional right-side action (also a rounded square).
 * Hidden in print so the printable area of the page doesn't include
 * the back chevron / icon button.
 */
export function PageHeader({
  title,
  subtitle,
  backHref = "/home",
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white print:hidden">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.25rem)] md:px-6">
        <Link
          href={backHref}
          aria-label="Back"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:opacity-80"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-[18px] font-bold leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action ?? <span className="h-10 w-10" />}
      </div>
    </header>
  );
}
