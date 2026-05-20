import { Button } from "@/components/ui/button";

// Temporary placeholder landing page so the smoke test in Sprint 1 has
// something to render. Sprint 2 replaces this with the real marketing
// surface and the (auth) flow.
export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        #becomeelite
      </span>
      <h1 className="text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
        QB Elite is moving to the web
      </h1>
      <p className="max-w-prose text-base text-muted-foreground">
        We&apos;re rebuilding QB Elite as a full Progressive Web App so you get
        the same training, plans, and Huddles on iPhone, Android, and desktop —
        with a free 7-day trial.
      </p>
      <div className="flex gap-3">
        <Button size="lg" disabled>
          Coming soon
        </Button>
      </div>
    </main>
  );
}
