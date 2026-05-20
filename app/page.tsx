import Link from "next/link";

import { Button } from "@/components/ui/button";

// Temporary marketing landing page. Sprint 5 replaces this with the
// real public marketing surface. For now it gives users a way into
// the auth flow.
export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        #becomeelite
      </span>
      <h1 className="text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
        Become Elite
      </h1>
      <p className="max-w-prose text-base text-muted-foreground">
        Full quarterback training on iPhone, Android, and desktop — workouts,
        meal plans, live Huddles with college and pro QBs. 7-day free trial.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/register">
          <Button size="lg">Start Free Trial</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">
            Log In
          </Button>
        </Link>
      </div>
    </main>
  );
}
