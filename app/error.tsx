"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Something broke
      </p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">
        Audible called
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Hit a snag rendering this page. Try again, or head home.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/home">Go home</a>
        </Button>
      </div>
    </div>
  );
}
