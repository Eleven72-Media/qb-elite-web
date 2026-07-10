import Link from "next/link";

import { Button } from "@/components/ui/button";

// Shown in place of the paywall while NEXT_PUBLIC_SUBSCRIPTIONS_PAUSED
// is true (subscription pivot 2026-07). No auth check here — anonymous
// visitors and signed-in users both see the same message.
export function PaywallPausedNotice() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-5 pb-8 pt-6 text-center md:px-6">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
        We&apos;re rebuilding
      </span>
      <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight">
        New subscriptions are paused.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We&apos;re redesigning QB Elite around one-time content packages instead
        of a monthly subscription. Sign-ups will reopen when the new experience
        is ready.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Want early access when it launches? Log in or create a free account —
        we&apos;ll notify you.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/home">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    </div>
  );
}
