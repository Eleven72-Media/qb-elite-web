import { ArrowUpRight, FolderHeart, Lock, Video } from "lucide-react";
import Link from "next/link";

/**
 * "Quick Actions" — two side-by-side gradient cards that mirror Flutter's
 * _HomeQuickActionCard exactly: 118-132px tall, 20px radius, accent
 * gradient corner blob, icon in a gradient pill, lock + outward-arrow
 * top-right.
 */
export function QuickActions({
  goatLocked,
}: {
  goatLocked: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <QuickActionCard
        href="/coaching"
        title="Monthly 1:1 call"
        subtitle="The GOAT — monthly virtual session"
        icon={<Video className="h-6 w-6" strokeWidth={1.6} />}
        showLock={goatLocked}
      />
      <QuickActionCard
        href="/resources"
        title="Resources"
        subtitle="Guides, media & more"
        icon={<FolderHeart className="h-6 w-6" strokeWidth={1.6} />}
      />
    </div>
  );
}

function QuickActionCard({
  href,
  title,
  subtitle,
  icon,
  showLock = false,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  showLock?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-[118px] flex-col justify-between overflow-hidden rounded-[20px] border border-border bg-muted p-3.5 shadow-sm transition-transform active:scale-[0.98]"
    >
      {/* Corner accent blob */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[18px] -top-[18px] h-[72px] w-[72px] rounded-full bg-primary/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent"
      />
      <div className="relative flex items-start justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-primary/20 bg-gradient-to-br from-primary/30 to-primary/8 text-primary">
          {icon}
        </div>
        <div className="flex items-center gap-1.5 text-foreground/60">
          {showLock && <Lock className="h-4 w-4" strokeWidth={1.75} />}
          <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
      </div>
      <div className="relative">
        <p className="line-clamp-2 text-[15px] font-semibold leading-tight text-foreground">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
