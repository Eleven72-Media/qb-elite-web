import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Not found — QB Elite" };

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight">
        Off the field
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        That page doesn&apos;t exist or has been moved. Let&apos;s get you back.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/home">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}
