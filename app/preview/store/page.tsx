import { ArrowRight, Bell, ShoppingBag } from "lucide-react";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Store — QB Elite",
  description:
    "QB Elite gear coming soon. Drop your email to be first in line when the store opens.",
};

/**
 * /preview/store — placeholder until Greg's storefront integration
 * is wired in. Per Justin's brief: "Store — takes to main page of
 * storefront." Once Greg's product feed is hooked up, swap the
 * placeholder hero for the real storefront grid.
 */
export default function StorePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <ComingSoonNotice />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[520px] w-full items-end overflow-hidden bg-brand-navy md:min-h-[600px]">
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
            QB Elite Store
          </span>
        </div>
        <h1 className="mt-6 font-display text-[56px] uppercase leading-[0.92] tracking-tight text-white md:text-[104px] lg:text-[128px]">
          Gear
          <br />
          <span className="text-primary">Coming Soon.</span>
        </h1>
        <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/80 md:text-lg">
          Tees, hoodies, hats, and training accessories — built around the
          QB Elite brand. We&rsquo;re wiring the storefront now.
        </p>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

function ComingSoonNotice() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="01"
          eyebrow="Stay Tuned"
          title={
            <>
              First Drop{" "}
              <span className="text-primary">Lands Soon.</span>
            </>
          }
          subhead="Drop your email and we'll send you a one-time note when the store opens. No spam, no list-mining — just the launch."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <article className="flex flex-col border border-brand-navy/12 bg-white p-9 shadow-[0_4px_20px_rgba(0,41,71,0.05)]">
            <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
              <ShoppingBag className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h3 className="mt-7 font-display text-[32px] uppercase leading-tight tracking-tight text-brand-navy md:text-[40px]">
              What&rsquo;s Coming
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] text-foreground/80">
              <li className="flex items-start gap-3 border-b border-brand-navy/10 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Tees
                </span>
                <span className="text-foreground/70">
                  Performance + lifestyle cuts in the QB Elite palette.
                </span>
              </li>
              <li className="flex items-start gap-3 border-b border-brand-navy/10 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Hoodies
                </span>
                <span className="text-foreground/70">
                  Cold-weather pullovers for camp + sideline.
                </span>
              </li>
              <li className="flex items-start gap-3 border-b border-brand-navy/10 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Hats
                </span>
                <span className="text-foreground/70">
                  Snapbacks + dad hats with the QBE wordmark.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Training
                </span>
                <span className="text-foreground/70">
                  Footballs, towels, training shorts, and field accessories.
                </span>
              </li>
            </ul>
          </article>

          <article className="flex flex-col border border-brand-navy/12 bg-brand-navy p-9 text-white shadow-[0_4px_20px_rgba(0,41,71,0.18)]">
            <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
              <Bell className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h3 className="mt-7 font-display text-[32px] uppercase leading-tight tracking-tight text-white md:text-[40px]">
              Get The Drop
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              Drop your email and we&rsquo;ll send one note when the store
              opens. First 50 in line get early access to the launch
              colorway.
            </p>
            <form className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 flex-1 border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/40 outline-none ring-primary/50 focus:ring-2"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-none bg-primary px-6 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white hover:bg-primary/90"
              >
                Notify Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
              No spam. One email when the store opens.
            </p>
            <div className="mt-auto pt-7">
              <Link
                href="/preview"
                className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/75 hover:text-white"
              >
                Back To Homepage
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
