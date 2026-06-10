import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Check,
  Dumbbell,
  MapPin,
  Mic,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "QB Academy — Bulk-Week Training | QB Elite",
  description:
    "Prepaid 5-week, 10-week, and extended training blocks with QB Elite coaches. Mechanics, film study, football IQ, and leadership — paired with the right coach for your region.",
};

/**
 * /preview/qb-academy — the QB Academy tab (training).
 *
 * Per Justin's brief: this is where we push the bulk-week prepaid
 * programs (5wk, 10wk, +). Page mirrors the flow chart's "QB Training
 * Tab" branch — hero → programs → find-your-coach (regional split)
 * → why QB Elite (four development pillars) → CTA.
 */
export default function QbAcademyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <ProgramsSection />
      <FindYourCoach />
      <WhyDifferent />
      <FinalCta />
    </main>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate flex min-h-[560px] w-full items-end overflow-hidden bg-brand-navy md:min-h-[640px]">
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
            QB Academy · Training
          </span>
        </div>
        <h1 className="mt-6 font-display text-[56px] uppercase leading-[0.92] tracking-tight text-white md:text-[104px] lg:text-[128px]">
          The Bulk-Week
          <br />
          <span className="text-primary">Prepaid Program.</span>
        </h1>
        <p className="mt-7 max-w-[640px] text-base leading-relaxed text-white/80 md:text-lg">
          5-week, 10-week, and extended training blocks with QB Elite
          coaches — paired by region so you&rsquo;re always working with the
          right coach for where you live.
        </p>
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link href="#programs">
            <Button
              size="lg"
              className="group h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90 sm:w-auto"
            >
              See The Programs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="#find-your-coach">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-none border-white/30 bg-white/5 px-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/15 hover:text-white sm:w-auto"
            >
              Find Your Coach
            </Button>
          </Link>
        </div>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

/* ─────────────────────────── 01 PROGRAMS ─────────────────────────── */

type Program = {
  id: string;
  eyebrow: string;
  title: string;
  weeks: string;
  description: string;
  includes: string[];
  cta: string;
  featured?: boolean;
};

const PROGRAMS: Program[] = [
  {
    id: "5-week",
    eyebrow: "Starter Block",
    title: "5-Week",
    weeks: "5 sessions",
    description:
      "A focused block to lock in mechanics and put the QB Elite system to work between camps.",
    includes: [
      "5 weekly 1:1 or small-group sessions",
      "Video review after every session",
      "QB Elite app — daily plan + film library",
      "Direct text access to your coach",
    ],
    cta: "Start The Block",
  },
  {
    id: "10-week",
    eyebrow: "Most Popular",
    title: "10-Week",
    weeks: "10 sessions",
    description:
      "The full season block. Mechanics + film study + football IQ + leadership cues, week over week.",
    includes: [
      "10 weekly 1:1 or small-group sessions",
      "Full game-film breakdown",
      "QB Elite app — daily plan + film library",
      "Direct text access to your coach",
      "Mid-block progress report",
    ],
    cta: "Start The Block",
    featured: true,
  },
  {
    id: "extended",
    eyebrow: "Year-Round",
    title: "Extended",
    weeks: "20+ sessions",
    description:
      "Full-year development for athletes building toward the next level. Talk to a coach to scope your block.",
    includes: [
      "20+ weekly sessions across the year",
      "Off-season + in-season programming",
      "Recruiting film support",
      "Priority camp + huddle access",
    ],
    cta: "Talk To A Coach",
  },
];

function ProgramsSection() {
  return (
    <section
      id="programs"
      className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="01"
          eyebrow="Programs"
          title={
            <>
              Pick Your <span className="text-primary">Block.</span>
            </>
          }
          subhead="Every program is prepaid up front — pay once, lock in your dates, and show up to train. No per-session billing, no surprise charges."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/55">
          Pricing per region. Talk to a coach for your block quote.
        </p>
      </div>
    </section>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const featured = program.featured;
  return (
    <article
      className={`group relative flex flex-col overflow-hidden border p-8 shadow-[0_4px_20px_rgba(0,41,71,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,41,71,0.12)] ${
        featured
          ? "border-primary bg-brand-navy text-white"
          : "border-brand-navy/12 bg-white"
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[3px] ${
          featured ? "bg-primary" : "origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
        }`}
      />

      <div className="flex items-center justify-between">
        <p
          className={`text-[11px] font-extrabold uppercase tracking-[0.24em] ${
            featured ? "text-primary" : "text-primary"
          }`}
        >
          {program.eyebrow}
        </p>
        <span
          className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${
            featured ? "text-white/55" : "text-brand-navy/45"
          }`}
        >
          {program.weeks}
        </span>
      </div>

      <h3
        className={`mt-5 font-display text-[44px] uppercase leading-none tracking-tight md:text-[56px] ${
          featured ? "text-white" : "text-brand-navy"
        }`}
      >
        {program.title}
      </h3>

      <p
        className={`mt-4 text-[15px] leading-relaxed ${
          featured ? "text-white/80" : "text-foreground/70"
        }`}
      >
        {program.description}
      </p>

      <ul className="mt-7 space-y-2.5">
        {program.includes.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2.5 text-[14px] leading-snug ${
              featured ? "text-white/85" : "text-foreground/80"
            }`}
          >
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                featured ? "text-primary" : "text-primary"
              }`}
              strokeWidth={2.5}
            />
            {item}
          </li>
        ))}
      </ul>

      <Link href="#find-your-coach" className="mt-8 block">
        <Button
          size="lg"
          className={`h-12 w-full rounded-none text-[12px] font-extrabold uppercase tracking-[0.16em] ${
            featured
              ? "bg-primary text-white shadow-[0_12px_30px_rgba(182,32,37,0.45)] hover:bg-primary/90"
              : "bg-brand-navy text-white hover:bg-brand-navyDeep"
          }`}
        >
          {program.cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </article>
  );
}

/* ─────────────────────────── 02 FIND YOUR COACH ─────────────────────────── */

type CoachPath = {
  id: string;
  region: string;
  coach: string;
  description: string;
  cta: string;
  href: string;
};

const COACH_PATHS: CoachPath[] = [
  {
    id: "south",
    region: "Utah County · Juab County",
    coach: "Coach Smith",
    description:
      "Train with Dustin Smith — QB Elite owner and head coach — in the Utah County / Juab County region.",
    cta: "Message Coach Smith",
    href: "/preview#contact",
  },
  {
    id: "north",
    region: "North Of Utah County · Utah",
    coach: "Coach Miller",
    description:
      "Train with Justin Miller. Direct scheduling — pick a time and confirm in a couple of clicks.",
    cta: "Schedule With Coach Miller",
    href: "https://app.mycoachflow.co/book/justin-miller-pzoq",
  },
  {
    id: "out-of-state",
    region: "Idaho · Nevada · Colorado · Arizona · Wyoming · Other",
    coach: "Coach Smith + Coach Miller",
    description:
      "Out-of-state? Send a message and we&rsquo;ll loop in the right coach for your region.",
    cta: "Message Our Coaches",
    href: "/preview#contact",
  },
];

function FindYourCoach() {
  return (
    <section
      id="find-your-coach"
      className="relative bg-brand-graphite px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="02"
          eyebrow="Find Your Coach"
          title={
            <>
              Paired With The
              <br />
              <span className="text-primary">Right Coach.</span>
            </>
          }
          subhead="QB Elite assigns you a coach based on where you live so you're working with someone close enough to train in person, week over week."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {COACH_PATHS.map((p) => (
            <CoachPathCard key={p.id} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachPathCard({ path }: { path: CoachPath }) {
  const external = path.href.startsWith("http");
  return (
    <Link
      href={path.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group relative flex flex-col overflow-hidden border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)] transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_40px_rgba(0,41,71,0.10)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />
      <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
        <MapPin className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-navy/55">
        {path.region}
      </p>
      <p className="mt-2 font-display text-[28px] uppercase tracking-tight text-brand-navy md:text-[32px]">
        {path.coach}
      </p>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/70">
        {path.description}
      </p>
      <div className="mt-7 flex items-center justify-between border-t border-brand-navy/10 pt-5">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-navy">
          {path.cta}
        </span>
        <span className="flex h-9 w-9 items-center justify-center bg-brand-navy/8 text-brand-navy transition-colors group-hover:bg-primary group-hover:text-white">
          {external ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────── 03 WHY DIFFERENT ─────────────────────────── */

const PILLARS = [
  {
    icon: Dumbbell,
    title: "Mechanics",
    description:
      "Footwork, throwing motion, base, and finish — drilled in every session and stamped into your film library.",
  },
  {
    icon: BookOpen,
    title: "Film Study",
    description:
      "We review your reps after every session and break down opponent tape so you walk into Friday night with answers.",
  },
  {
    icon: Brain,
    title: "Football IQ",
    description:
      "Coverage recognition, protections, hot reads. The decision-making layer that separates good from elite.",
  },
  {
    icon: Mic,
    title: "Leadership",
    description:
      "Cadence, communication, and the mindset to lead the huddle. Quarterbacks lead — we coach the soft skills too.",
  },
] as const;

function WhyDifferent() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="03"
          eyebrow="Why QB Elite Training"
          title={
            <>
              The Complete
              <br />
              <span className="text-primary">Quarterback.</span>
            </>
          }
          subhead="Other programs train arms or athleticism. QB Elite trains the four things that actually win Friday nights."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="flex flex-col border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
                <p.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 font-display text-[26px] uppercase leading-tight tracking-tight text-brand-navy">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/70">
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 04 FINAL CTA ─────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-navyDeep px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
      />
      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
            Ready To Get To Work?
          </p>
          <h2 className="mt-3 font-display text-[40px] uppercase leading-[1.02] tracking-tight text-white md:text-[64px]">
            Lock In <span className="text-primary">Your Block.</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-white/75 md:text-lg">
            Pick your program above, get paired with your coach, and start
            training next week.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Trophy
            className="hidden h-10 w-10 text-primary md:block"
            strokeWidth={1.5}
          />
          <Link href="#find-your-coach">
            <Button
              size="lg"
              className="h-14 rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90"
            >
              Find Your Coach
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
