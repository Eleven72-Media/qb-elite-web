"use client";

import { Check, Crown, Sparkles } from "lucide-react";
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
    <div className="mx-auto w-full max-w-[820px] px-5 pb-6 pt-2 md:px-6">
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          7-day free trial
        </span>
        <h1 className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight">
          Start training.
          <br />
          Free for 7 days.
        </h1>
        <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
          No charge for the first week. Cancel any time in Settings.
        </p>
      </header>

      {canceled && (
        <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
          Checkout canceled. Pick a plan to try again.
        </div>
      )}

      {alreadyOnApple && (
        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm text-foreground">
          You&apos;re already subscribed via Apple. Manage your subscription in
          iPhone Settings → your name → Subscriptions.
        </div>
      )}

      <div className="mt-5">
        <IntervalToggle interval={interval} onChange={setInterval} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TierCard
          name="Starter"
          tagline="Get started with weekly QB training"
          price={TIER_PRICING.starter[interval].price}
          period={interval === "yearly" ? "/yr" : "/mo"}
          features={STARTER_FEATURES}
          busy={busy === "starter"}
          disabled={alreadyOnApple || !!busy}
          onSelect={() => startCheckout("starter")}
        />
        <TierCard
          name="Legend"
          tagline="The full QB Elite experience"
          price={TIER_PRICING.legend[interval].price}
          period={interval === "yearly" ? "/yr" : "/mo"}
          features={LEGEND_FEATURES}
          highlight
          busy={busy === "legend"}
          disabled={alreadyOnApple || !!busy}
          onSelect={() => startCheckout("legend")}
        />
      </div>

      <section className="mt-5 flex items-center gap-3 rounded-2xl bg-muted p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Crown className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold">GOAT — 1-on-1 coaching</p>
          <p className="text-[12px] text-muted-foreground">
            Custom-priced per athlete.
          </p>
        </div>
        <a
          href="mailto:eleven72media@gmail.com?subject=QB%20Elite%20GOAT%20Tier%20%E2%80%94%20pricing%20inquiry"
          className="shrink-0 text-sm font-bold text-primary hover:underline"
        >
          Contact →
        </a>
      </section>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
        Your first 7 days are free. After the trial, your subscription auto-renews
        at the price shown and is billed to your card. Cancel any time in
        Settings — if you cancel before day 8, you won&apos;t be charged. By
        starting your trial you agree to our{" "}
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
      <div className="mt-3 text-center">
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
    <div className="mx-auto flex w-fit gap-1 rounded-full bg-muted p-1">
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
        "rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground"
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
  period,
  features,
  highlight,
  busy,
  disabled,
  onSelect,
}: {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
  busy: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-3xl bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1",
        highlight
          ? "ring-2 ring-primary shadow-[0_8px_28px_rgba(182,31,38,0.18)]"
          : "ring-black/5"
      )}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
          Most Popular
        </span>
      )}
      <h2 className="text-[18px] font-extrabold tracking-tight">{name}</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">{tagline}</p>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-[30px] font-extrabold tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
            <span className="text-foreground/85">{f}</span>
          </li>
        ))}
      </ul>
      <Button
        size="lg"
        className="mt-5 h-12 rounded-2xl text-base"
        onClick={onSelect}
        disabled={disabled}
        variant={highlight ? "default" : "outline"}
      >
        {busy ? "Loading…" : "Start Free Trial"}
      </Button>
    </article>
  );
}
