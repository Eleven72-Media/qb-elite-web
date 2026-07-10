import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Offline — QB Elite" };

export default function Offline() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        No signal
      </p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">
        You&apos;re offline
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Reconnect to load fresh workouts, film, and meal plans. Already-viewed
        screens may still work from cache.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/home">Try home</Link>
        </Button>
      </div>
    </div>
  );
}
