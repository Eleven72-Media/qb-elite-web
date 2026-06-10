"use client";

import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Tier = {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  /** Saves users $$$ on annual — show only if value present. */
  yearlySavings?: string;
  description: string;
  cta: string;
  ctaHref: string;
  featured?: boolean;
  /** Two-state feature matrix. `true` = included, `false` = not included. */
  features: { label: string; included: boolean }[];
};

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "The Starter",
    monthlyPrice: "$29.99",
    yearlyPrice: "$299",
    yearlySavings: "Save $61",
    description:
      "A structured, week-by-week QB development program that builds elite mechanics, mindset, leadership, nutrition, and training habits — with progressive videos, workouts, resources, and monthly expert huddles.",
    cta: "Start Free Trial",
    ctaHref: "https://www.qbeliteapp.com/",
    features: [
      { label: "Weekly Training Videos", included: true },
      { label: "Athlete Resources", included: true },
      { label: "Nutrition Training & Recipes", included: true },
      { label: "Elite Workouts", included: true },
      { label: "Track Your Progress", included: true },
      { label: "Monthly Huddles", included: true },
      { label: "Weekly Workout Plans", included: true },
      { label: "Weekly Recipe Plans", included: true },
      { label: "Live Film Breakdowns", included: false },
      { label: "On-Demand Film Breakdowns", included: false },
      { label: "Custom Workouts & Meal Plans", included: false },
      { label: "Dedicated Personal Coach", included: false },
      { label: "Monthly 1:1 Virtual Call", included: false },
    ],
  },
  {
    id: "legend",
    name: "The Legend",
    badge: "Most Popular",
    monthlyPrice: "$69.99",
    yearlyPrice: "$774",
    yearlySavings: "Save $66",
    description:
      "Everything in The Starter, plus weekly structured workout and recipe plans and access to live and recorded group film breakdowns with coach-led Q&A.",
    cta: "Start Free Trial",
    ctaHref: "https://www.qbeliteapp.com/",
    featured: true,
    features: [
      { label: "Weekly Training Videos", included: true },
      { label: "Athlete Resources", included: true },
      { label: "Nutrition Training & Recipes", included: true },
      { label: "Elite Workouts", included: true },
      { label: "Track Your Progress", included: true },
      { label: "Monthly Huddles", included: true },
      { label: "Weekly Workout Plans", included: true },
      { label: "Weekly Recipe Plans", included: true },
      { label: "Live Film Breakdowns", included: true },
      { label: "On-Demand Film Breakdowns", included: true },
      { label: "Custom Workouts & Meal Plans", included: true },
      { label: "Dedicated Personal Coach", included: false },
      { label: "Monthly 1:1 Virtual Call", included: false },
    ],
  },
  {
    id: "goat",
    name: "The GOAT",
    monthlyPrice: "Contact",
    yearlyPrice: "Contact",
    description:
      "The ultimate personalized development experience. Everything in The Legend, plus a dedicated personal coach, monthly 1:1 virtual calls, individualized film breakdowns, and custom weekly workouts + nutrition.",
    cta: "Talk To A Coach",
    ctaHref: "/preview#contact",
    features: [
      { label: "Weekly Training Videos", included: true },
      { label: "Athlete Resources", included: true },
      { label: "Nutrition Training & Recipes", included: true },
      { label: "Elite Workouts", included: true },
      { label: "Track Your Progress", included: true },
      { label: "Monthly Huddles", included: true },
      { label: "Weekly Workout Plans", included: true },
      { label: "Weekly Recipe Plans", included: true },
      { label: "Live Film Breakdowns", included: true },
      { label: "On-Demand Film Breakdowns", included: true },
      { label: "Custom Workouts & Meal Plans", included: true },
      { label: "Dedicated Personal Coach", included: true },
      { label: "Monthly 1:1 Virtual Call", included: true },
    ],
  },
];

export function PricingTiers() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
      {/* Monthly / Yearly toggle */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex border border-brand-navy/15 bg-white p-1">
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              className={`px-6 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] transition-colors ${
                billing === option
                  ? "bg-brand-navy text-white"
                  : "text-brand-navy/70 hover:text-brand-navy"
              }`}
            >
              {option}
              {option === "yearly" && (
                <span className="ml-2 inline-flex items-center bg-primary px-1.5 py-0.5 text-[9px] tracking-wider text-white">
                  Save
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} billing={billing} />
        ))}
      </div>
    </>
  );
}

function TierCard({
  tier,
  billing,
}: {
  tier: Tier;
  billing: "monthly" | "yearly";
}) {
  const price = billing === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
  const suffix =
    tier.id === "goat"
      ? "for Pricing"
      : billing === "monthly"
        ? "per Month"
        : "per Year";
  const featured = tier.featured;

  return (
    <article
      className={`relative flex flex-col overflow-hidden border p-8 shadow-[0_4px_20px_rgba(0,41,71,0.05)] ${
        featured
          ? "border-primary bg-brand-navy text-white"
          : "border-brand-navy/12 bg-white"
      }`}
    >
      {tier.badge && (
        <span className="absolute right-6 top-6 inline-flex items-center bg-primary px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
          {tier.badge}
        </span>
      )}

      <p
        className={`text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary`}
      >
        Tier
      </p>
      <h3
        className={`mt-2 font-display text-[40px] uppercase leading-none tracking-tight md:text-[44px] ${
          featured ? "text-white" : "text-brand-navy"
        }`}
      >
        {tier.name}
      </h3>

      <div className="mt-6 flex items-baseline gap-2">
        <span
          className={`font-display text-[44px] uppercase leading-none tracking-tight md:text-[52px] ${
            featured ? "text-white" : "text-brand-navy"
          }`}
        >
          {price}
        </span>
        <span
          className={`text-[12px] font-extrabold uppercase tracking-[0.14em] ${
            featured ? "text-white/70" : "text-foreground/55"
          }`}
        >
          {suffix}
        </span>
      </div>
      {billing === "yearly" && tier.yearlySavings && tier.id !== "goat" && (
        <p
          className={`mt-2 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
            featured ? "text-primary" : "text-primary"
          }`}
        >
          {tier.yearlySavings} vs Monthly
        </p>
      )}

      <p
        className={`mt-5 text-[14px] leading-relaxed ${
          featured ? "text-white/80" : "text-foreground/70"
        }`}
      >
        {tier.description}
      </p>

      <ul className="mt-7 space-y-2.5 border-t border-white/10 pt-6">
        {tier.features.map((f) => (
          <li
            key={f.label}
            className={`flex items-start gap-2.5 text-[13px] leading-snug ${
              f.included
                ? featured
                  ? "text-white"
                  : "text-foreground/85"
                : featured
                  ? "text-white/35 line-through"
                  : "text-foreground/35 line-through"
            }`}
          >
            {f.included ? (
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                strokeWidth={2.5}
              />
            ) : (
              <X
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  featured ? "text-white/30" : "text-foreground/25"
                }`}
                strokeWidth={2}
              />
            )}
            {f.label}
          </li>
        ))}
      </ul>

      <Link href={tier.ctaHref} className="mt-8 block">
        <Button
          size="lg"
          className={`h-12 w-full rounded-none text-[12px] font-extrabold uppercase tracking-[0.16em] ${
            featured
              ? "bg-primary text-white shadow-[0_12px_30px_rgba(182,32,37,0.45)] hover:bg-primary/90"
              : "bg-brand-navy text-white hover:bg-brand-navyDeep"
          }`}
        >
          {tier.cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </article>
  );
}
