"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TIER_PRICING, type SubscriptionInterval } from "@/lib/stripe/prices";
import { cn } from "@/lib/utils";

const STARTER_FEATURES = [
  "Weekly QB workouts + mechanics drills",
  "Weekly meal plans built for QBs",
  "Live group Huddles with coaches",
  "Full classroom + film library",
];

const LEGEND_FEATURES = [
  "Everything in Starter",
  "Weekly Film Breakdown Q&A",
  "Advanced film studies",
  "Priority Huddle access",
];

export function PaywallClient({
  currentTier,
  currentSource,
  canceled,
}: {
  currentTier: string;
  currentSource: string | null;
  canceled: boolean;
}) {
  const { toast } = useToast();
  const [interval, setInterval] = useState<SubscriptionInterval>("monthly");
  const [busy, setBusy] = useState<null | "starter" | "legend">(null);

  async function startCheckout(tier: "starter" | "legend") {
    setBusy(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Couldn't start checkout");
      }
      window.location.href = data.url;
    } catch (e) {
      setBusy(null);
      toast({
        title: "Couldn't start checkout",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  const alreadyOnApple = currentSource === "apple" && currentTier !== "free";

  return (
    <div className="container max-w-3xl py-8">
      <header className="mb-6 text-center">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          7-day free trial
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
          Start training. Free for 7 days.
        </h1>
        <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
          No charge for the first week. Cancel any time in Settings.
        </p>
      </header>

      {canceled && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive">
          Checkout canceled. Pick a plan to try again.
        </div>
      )}

      {alreadyOnApple && (
        <div className="mb-6 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-center text-sm">
          You&apos;re already subscribed via Apple. Manage your subscription in
          iPhone Settings → your name → Subscriptions.
        </div>
      )}

      <IntervalToggle interval={interval} onChange={setInterval} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TierCard
          tier="starter"
          name="Starter"
          tagline="Get started with weekly QB training"
          price={TIER_PRICING.starter[interval].price}
          features={STARTER_FEATURES}
          busy={busy === "starter"}
          disabled={alreadyOnApple || !!busy}
          onSelect={() => startCheckout("starter")}
        />
        <TierCard
          tier="legend"
          name="Legend"
          tagline="The full QB Elite experience"
          price={TIER_PRICING.legend[interval].price}
          features={LEGEND_FEATURES}
          highlight
          busy={busy === "legend"}
          disabled={alreadyOnApple || !!busy}
          onSelect={() => startCheckout("legend")}
        />
      </div>

      <section className="mt-6 rounded-2xl border bg-card p-5 text-center text-sm">
        <p className="font-semibold">GOAT — 1-on-1 coaching</p>
        <p className="mt-1 text-muted-foreground">
          Custom-priced per athlete. Talk to a coach for a quote.
        </p>
        <a
          href="mailto:eleven72media@gmail.com?subject=QB%20Elite%20GOAT%20Tier%20%E2%80%94%20pricing%20inquiry"
          className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          Email Coach Miller →
        </a>
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Your first 7 days are free. After the trial, your subscription auto-
        renews at the price shown and is billed to your card. Cancel any time
        in Settings — if you cancel before day 8, you won&apos;t be charged.
        By starting your trial you agree to our{" "}
        <a
          href="https://qb-elite-launch.web.app/terms-of-service"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="https://qb-elite-launch.web.app/privacy-policy"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-4 text-center">
        <Link
          href="/home"
          className="text-xs text-muted-foreground hover:underline"
        >
          Maybe later
        </Link>
      </div>
    </div>
  );
}

function IntervalToggle({
  interval,
  onChange,
}: {
  interval: SubscriptionInterval;
  onChange: (i: SubscriptionInterval) => void;
}) {
  return (
    <div className="mx-auto flex w-fit gap-1 rounded-full border bg-card p-1 shadow-sm">
      <ToggleButton
        active={interval === "monthly"}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </ToggleButton>
      <ToggleButton
        active={interval === "yearly"}
        onClick={() => onChange("yearly")}
      >
        Yearly · save 17%
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function TierCard({
  name,
  tagline,
  price,
  features,
  highlight,
  busy,
  disabled,
  onSelect,
}: {
  tier: "starter" | "legend";
  name: string;
  tagline: string;
  price: string;
  features: string[];
  highlight?: boolean;
  busy: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
        highlight && "border-primary ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-baseline gap-2">
        <h2 className="text-xl font-extrabold uppercase tracking-tight">
          {name}
        </h2>
        {highlight && (
          <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Popular
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      <p className="mt-3 text-3xl font-extrabold">{price}</p>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        size="lg"
        className="mt-5"
        onClick={onSelect}
        disabled={disabled}
        variant={highlight ? "default" : "outline"}
      >
        {busy ? "Loading…" : "Start Free Trial"}
      </Button>
    </article>
  );
}
