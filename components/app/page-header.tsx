import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/**
 * Flutter-style page header — rounded-square back button on the left,
 * centered title. Used on inner screens that aren't the four tab roots.
 */
export function PageHeader({
  title,
  backHref = "/home",
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.25rem)] md:px-6">
        <Link
          href={backHref}
          aria-label="Back"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground active:opacity-80"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
        </Link>
        <h1 className="flex-1 text-center text-[18px] font-bold">{title}</h1>
        <span className="h-10 w-10" />
      </div>
    </header>
  );
}
