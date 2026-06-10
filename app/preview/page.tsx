import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  Facebook,
  Instagram,
  Play,
  Smartphone,
  Star,
  Target,
  Youtube,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "QB Elite — Become Elite",
  description:
    "Quarterback training that turns developing players into elite competitors. Camps, 1:1 training, and the QB Elite app — built by QBs, for QBs.",
};

/**
 * qbelite.com homepage refresh — preview only, lives at
 * qbeliteapp.com/preview. Visual language pulled from
 * jenkinselite.com + qbtakeover.com: dark backdrop, ALL-CAPS bold
 * type, numbered sections, red accents, dashed dividers, action
 * photography. QB Elite brand colors throughout (navy #003554,
 * red #B62025).
 *
 * Structure mirrors the Sun Jun 7 flow chart:
 *   00 hero / intro video
 *   01 three pillars (camps · training · app)
 *   02 pedigree (coaches + alumni teams)
 *   03 by the numbers
 *   04 testimonials
 *   05 contact
 */
export default function HomepagePreview() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <PillarsSection />
      <PedigreeSection />
      <ByTheNumbers />
      <PedigreeLogoGallery />
      <FeaturedOnStrip />
      <TestimonialsSection />
      <ContactSection />
      <SocialFollowSection />
    </main>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[760px] w-full items-end overflow-hidden bg-brand-navy md:min-h-[860px] lg:min-h-[920px]"
    >
      {/* Solid brand-navy placeholder. When ready, swap the section
          background for a full-bleed <video poster=... autoplay muted
          loop playsinline> or an <Image fill> of camp/drone footage —
          Justin's brief calls for a drone-zoom intro animation as v2
          motion treatment. */}

      {/* Centered play affordance for the intro video. Floats over the
          backdrop so the user knows the hero is the video. */}
      <button
        type="button"
        aria-label="Play intro video"
        className="group absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 md:top-[44%]"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_60px_rgba(182,32,37,0.65)] transition-transform group-hover:scale-105 md:h-24 md:w-24">
          <Play className="h-7 w-7 translate-x-0.5 fill-current md:h-9 md:w-9" />
        </span>
        <span className="mt-4 block text-center text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">
          Watch The Story
        </span>
      </button>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pb-20 pt-40 md:px-10 md:pb-28 md:pt-48">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              Quarterback Training
            </span>
          </div>

          <h1 className="mt-6 font-display text-[64px] uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] md:text-[120px] lg:text-[148px]">
            Become
            <br />
            <span className="text-primary">Elite.</span>
          </h1>

          <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-lg">
            Developing the complete quarterback — where the next
            generation of college and pro QBs train.
          </p>

          {/* Hero stat — single most impressive number, per Justin's brief */}
          <div className="mt-8 flex items-center gap-5">
            <span className="text-[44px] font-black leading-none tracking-tight text-primary drop-shadow-[0_4px_20px_rgba(182,32,37,0.6)] md:text-[56px]">
              500+
            </span>
            <span className="text-[11px] font-extrabold uppercase leading-tight tracking-[0.18em] text-white/85 md:text-[12px]">
              Quarterbacks Trained
              <br />
              Across 20+ States
            </span>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link href="#contact">
              <Button
                size="lg"
                className="group h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90 sm:w-auto"
              >
                Become Elite Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/preview/qb-academy">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-none border-white/30 bg-white/5 px-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Explore Training
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

/* ───────────────────────────── FEATURED ON ───────────────────────────── */

function FeaturedOnStrip() {
  const outlets = ["ESPN", "247Sports", "Rivals", "MaxPreps", "On3", "Deseret News"];
  return (
    <section className="relative bg-brand-graphite">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-10 px-5 pb-20 pt-16 md:px-10 md:pb-24 md:pt-20">
        <h3 className="text-center font-display text-5xl uppercase leading-none tracking-tight text-primary md:text-[72px]">
          Featured On
        </h3>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-16">
          {outlets.map((o) => (
            <li
              key={o}
              className="text-[15px] font-extrabold uppercase tracking-[0.18em] text-white opacity-40 transition-opacity duration-200 hover:opacity-100"
            >
              {o}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── 01 PILLARS ───────────────────────────── */

const PILLARS = [
  {
    id: "camps",
    eyebrow: "In-Person",
    title: "Camps",
    description:
      "Multi-day intensives across Utah and the Mountain West. Mechanics, footwork, film, and competition in a small-group setting.",
    cta: "Schedule / Upcoming Camps",
    href: "/preview/camps",
    icon: CalendarDays,
  },
  {
    id: "training",
    eyebrow: "Bulk-Week Programs",
    title: "QB Academy",
    description:
      "5-week, 10-week, and extended prepaid training blocks with QB Elite coaches. Paired by zip code so you're working with the right coach for your region.",
    cta: "Start Your Block",
    href: "/preview/qb-academy",
    icon: Dumbbell,
  },
  {
    id: "app",
    eyebrow: "Online Training",
    title: "QB Elite App",
    description:
      "Training on the go — nonstop improvement even when you're away from coaches. Daily workouts, film breakdowns, meal plans, and live Huddles on iPhone, Android, and web.",
    cta: "Access The App",
    href: "/preview/app",
    icon: Smartphone,
  },
] as const;

function PillarsSection() {
  return (
    <section
      id="pillars"
      className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="01"
          eyebrow="Training & Programs"
          title={
            <>
              Three Ways To Train
              <br />
              With <span className="text-primary">QB Elite</span>.
            </>
          }
          subhead="Whether you're six months out from your first varsity start or chasing a scholarship offer, there's a path that fits."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <PillarCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  eyebrow,
  title,
  description,
  cta,
  href,
  icon: Icon,
}: (typeof PILLARS)[number]) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden border border-brand-navy/12 bg-white p-8 shadow-[0_4px_20px_rgba(0,41,71,0.05)] transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(0,41,71,0.10)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-navy/55">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-8 font-display text-[34px] uppercase leading-tight tracking-tight text-brand-navy md:text-[40px]">
        {title}
      </h3>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/70">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-brand-navy/10 pt-5">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-navy">
          {cta}
        </span>
        <span className="flex h-9 w-9 items-center justify-center bg-brand-navy/8 text-brand-navy transition-colors group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

/* ───────────────────────────── 02 PEDIGREE ───────────────────────────── */

/**
 * Coaches sourced from qbelite.com/instructors (2026-06-08) plus
 * Justin Miller added per Justin's brief. "Coaching Staff" = the three
 * full-time QB Elite coaches. "Guest Coaches" = pro/college veterans
 * who join camps and film sessions. Per Justin: never use "instructor"
 * or "assistant coach" anywhere — every role label is a credential or
 * the word "coach".
 */
type Coach = { name: string; role: string; photo: string };

const COACHING_STAFF: Coach[] = [
  {
    name: "Dustin Smith",
    role: "Owner · QB Elite Coach",
    photo: "/coaches/dustin_smith.jpg",
  },
  {
    name: "Ty Detmer",
    role: "14-Yr NFL QB · Heisman Trophy Winner",
    photo: "/coaches/ty_detmer.jpg",
  },
  {
    name: "Justin Miller",
    role: "QB Elite Coach",
    photo: "/coaches/justin_miller.webp",
  },
];

const GUEST_COACHES: Coach[] = [
  {
    name: "Mark Brunell",
    role: "18-Yr NFL QB",
    photo: "/coaches/mark_brunell.jpg",
  },
  {
    name: "Kurt Warner",
    role: "2x NFL MVP · 12-Yr NFL QB",
    photo: "/coaches/kurt_warner.jpg",
  },
  {
    name: "Koy Detmer",
    role: "10-Yr NFL QB",
    photo: "/coaches/koy_detmer.jpg",
  },
  {
    name: "Brandon Doman",
    role: "Former D1 Coach · NFL QB",
    photo: "/coaches/brandon_doman.jpg",
  },
  {
    name: "John Madsen",
    role: "Former NFL TE",
    photo: "/coaches/john_madsen.jpg",
  },
  {
    name: "Ben Cahoon",
    role: "15-Yr Pro · Former D1 WR Coach",
    photo: "/coaches/ben_cahoon.jpg",
  },
  {
    name: "Max Hall",
    role: "Former NFL QB · BYU All-Time Wins Leader",
    photo: "/coaches/max_hall.jpg",
  },
  {
    name: "Landon Taylor",
    role: "Utah Football Academy Co-Founder",
    photo: "/coaches/landon_taylor.jpg",
  },
];

function PedigreeSection() {
  return (
    <section
      id="pedigree"
      className="relative bg-gradient-to-b from-brand-navy via-brand-navy to-brand-navyDeep px-5 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[#0693e3]/10 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1320px]">
        {/* Philosophy block leads — north-star goal + the three coaching
            pillars set the WHY before the WHO (coaches) below. */}
        <PhilosophyBlock />

        {/* Coaches header row — flows naturally out of the philosophy.
            SectionHeader on the left, "See All" CTA pinned to the
            bottom-right on desktop. Stacks on mobile. */}
        <div className="mt-24 flex flex-col gap-8 border-t border-white/10 pt-16 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="flex-1">
            <SectionHeader
              number="02"
              eyebrow="Why Work With QB Elite?"
              title={
                <>
                  Built By QBs Who&rsquo;ve
                  <br />
                  <span className="text-primary">Been There.</span>
                </>
              }
              subhead="Mechanics, film study, football IQ, and leadership — every cue comes from coaches who've lived the position. NFL MVPs, Heisman winners, 15-year pros."
            />
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <Link href="/preview/about">
              <Button
                size="lg"
                className="h-14 rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.45)] hover:bg-primary/90"
              >
                See All Coaches + Alumni
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/45">
              500+ Alumni · 20+ States
            </p>
          </div>
        </div>

        {/* Coaching staff — 3-up, full-time QB Elite coaches */}
        <div className="mx-auto mt-16 max-w-2xl">
          <CoachTierHeader title="Coaching Staff" count={COACHING_STAFF.length} />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
            {COACHING_STAFF.map((c) => (
              <CoachCard key={c.name} coach={c} featured />
            ))}
          </div>
        </div>

        {/* Guest coaches — 4-up (8 names → 2 rows of 4 on desktop) */}
        <div className="mx-auto mt-16 max-w-3xl">
          <CoachTierHeader title="Guest Coaches" count={GUEST_COACHES.length} />
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {GUEST_COACHES.map((c) => (
              <CoachCard key={c.name} coach={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────── Our Philosophy (sub-block within Pedigree section) ──────────── */

const PHILOSOPHY_PILLARS = [
  {
    icon: Target,
    title: "Simple & Repeatable Mechanics",
    description:
      "Clean base, efficient drop, on-balance release. We teach a mechanical foundation a 7th-grader and a college starter can both run — because the cues stay the same as the speed of the game rises.",
  },
  {
    icon: Zap,
    title: "Athleticism",
    description:
      "Strength, mobility, and explosiveness built specifically for the position. Weight Room programming is QB-first: extend plays with your feet, deliver from any platform, last all four quarters.",
  },
  {
    icon: ClipboardList,
    title: "Chalk Talk",
    description:
      "Film study, coverage recognition, and football IQ. The throw is half the position — knowing where the throw should go before the snap is the other half. We coach the brain alongside the body.",
  },
];

function PhilosophyBlock() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="h-px w-16 bg-primary md:w-20" />
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
          Our Philosophy
        </p>
      </div>
      <h3 className="mt-5 font-display text-[36px] uppercase leading-[1.02] tracking-tight text-white md:text-[56px] lg:text-[68px]">
        The Goal Is{" "}
        <span className="text-primary">On-Time, Consistent Throws.</span>
      </h3>
      <p className="mt-5 max-w-[720px] text-base leading-relaxed text-white/65 md:text-lg">
        Every drill, every rep, every film clip at QB Elite is built around
        one outcome: getting the ball out on time, to the right spot, on
        every snap. We get there through three pillars.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
        {PHILOSOPHY_PILLARS.map((p) => (
          <div
            key={p.title}
            className="group flex flex-col border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-primary/40"
          >
            <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
              <p.icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h4 className="mt-6 font-display text-[22px] uppercase leading-tight tracking-tight text-white md:text-[26px]">
              {p.title}
            </h4>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachTierHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-end justify-between border-b border-white/10 pb-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
        {title}
      </p>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
        {count} Total
      </span>
    </div>
  );
}

function CoachCard({ coach, featured = false }: { coach: Coach; featured?: boolean }) {
  return (
    <figure className="group relative overflow-hidden border border-white/10 bg-white/[0.03] transition-colors hover:border-primary/50">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-navyDeep">
        <Image
          src={coach.photo}
          alt={coach.name}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bottom darken keeps the name legible over busy headshots */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/55 to-transparent"
        />
        {/* Red corner accent on featured (staff) cards */}
        {featured && (
          <span
            aria-hidden
            className="absolute left-0 top-0 h-8 w-1 bg-primary"
          />
        )}
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[14px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white">
          {coach.name}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
          {coach.role}
        </p>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────────── 03 BY THE NUMBERS ───────────────────────────── */

const STATS = [
  { value: "500+", label: "QBs Trained" },
  { value: "20+", label: "States Served" },
  { value: "$12M+", label: "Scholarships Earned" },
  { value: "85%", label: "Camp Retention" },
];

function ByTheNumbers() {
  return (
    <section className="relative overflow-hidden bg-brand-graphite px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="03"
          eyebrow="By The Numbers"
          title={<span className="text-primary">Elite Results.</span>}
        />

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-white/10 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-brand-graphite p-8 md:p-10"
            >
              <p className="font-display text-5xl leading-none tracking-tight text-white md:text-[72px]">
                {s.value}
              </p>
              <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── PEDIGREE LOGOS ───────────────────────────── */

/**
 * Schools + organizations our coaches and alumni have played for / been
 * affiliated with. Each entry can carry an optional `logo` path
 * (PNG/SVG in /public/pedigree/, white-on-transparent) — when present
 * we render the image; otherwise we fall back to a wordmark of the
 * organization's name. Drop SVGs in as you obtain rights to use them.
 */
type PedigreeOrg = { name: string; logo?: string };

/**
 * Colleges = every school in Justin's alumni list (2026-06-08),
 * deduped + alphabetized, including non-D1 programs (Adams State,
 * Midland, Snow College) per Justin's "merge with Colleges" call.
 *
 * Pro Teams = every NFL franchise an alum or coach played for
 * (alumni: Wilson, Hall, Dart) + (coaches: Ty Detmer, Brunell,
 * Warner, Koy Detmer, Doman, Madsen, Max Hall) + Montreal
 * Alouettes for Ben Cahoon's 15-yr CFL career.
 */
const PEDIGREE_COLLEGES: PedigreeOrg[] = [
  { name: "Adams State" },
  { name: "Boise State" },
  { name: "BYU" },
  { name: "Hawaii" },
  { name: "Midland" },
  { name: "Montana" },
  { name: "Ole Miss" },
  { name: "Oklahoma" },
  { name: "Snow College" },
  { name: "SUU" },
  { name: "Texas A&M" },
  { name: "USC" },
  { name: "Utah" },
  { name: "Utah State" },
  { name: "Utah Tech" },
  { name: "Weber State" },
  { name: "Western Kentucky" },
];

const PEDIGREE_PROS: PedigreeOrg[] = [
  { name: "Alouettes" },
  { name: "Broncos" },
  { name: "Browns" },
  { name: "Cardinals" },
  { name: "Commanders" },
  { name: "Eagles" },
  { name: "Falcons" },
  { name: "49ers" },
  { name: "Giants" },
  { name: "Jaguars" },
  { name: "Jets" },
  { name: "Lions" },
  { name: "Packers" },
  { name: "Raiders" },
  { name: "Rams" },
  { name: "Saints" },
  { name: "Seahawks" },
  { name: "Vikings" },
];

function PedigreeLogoGallery() {
  return (
    <section className="relative bg-brand-graphite px-5 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24">
      <div className="mx-auto w-full max-w-[1320px]">
        <h3 className="text-center font-display text-5xl uppercase leading-none tracking-tight text-primary md:text-[72px]">
          Schools &amp; Organizations
        </h3>

        <div className="mt-16">
          <PedigreeRow label="Colleges" orgs={PEDIGREE_COLLEGES} />
        </div>
        <div className="mt-14">
          <PedigreeRow label="Pro Teams" orgs={PEDIGREE_PROS} />
        </div>
      </div>
    </section>
  );
}

function PedigreeRow({
  label,
  orgs,
}: {
  label: string;
  orgs: PedigreeOrg[];
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/55">
          {label}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="mt-7 grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-x-10">
        {orgs.map((org) => (
          <div
            key={org.name}
            className="group flex items-center justify-center"
          >
            {org.logo ? (
              <Image
                src={org.logo}
                alt={org.name}
                width={120}
                height={48}
                className="h-12 w-auto object-contain opacity-40 transition-opacity duration-200 group-hover:opacity-100"
              />
            ) : (
              <span className="text-[17px] font-black uppercase tracking-[0.1em] text-white opacity-40 transition-opacity duration-200 group-hover:opacity-100">
                {org.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────── 04 TESTIMONIALS ───────────────────────────── */

/**
 * Real reviews pulled from qbelite.com (homepage + /testimonials/)
 * on 2026-06-08 — verbatim text, original attributions. When new
 * reviews come in, append here; oldest-first is fine since the
 * grid renders left→right and the strongest names anchor either end.
 */
const TESTIMONIALS = [
  {
    quote:
      "I would not have received my scholarship had I not taken advantage of the training I received through QB Elite.",
    name: "Troy",
    role: "QB Elite Athlete",
  },
  {
    quote:
      "I'm so impressed with QB Elite. I would recommend my QBs to Dustin Smith to train and we live in Florida!",
    name: "Mark Brunell",
    role: "3x NFL Pro Bowl QB · 1991 Rose Bowl MVP",
  },
  {
    quote:
      "We have seen a lot of coaches and spent a lot of money over the years. Coach Smith is the best. Worth every penny! Do the work! Be Elite!",
    name: "Ryan",
    role: "QB Elite Parent",
  },
] as const;

function TestimonialsSection() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="04"
          eyebrow="Testimonials"
          title={<span className="text-primary">Hear From Our Athletes.</span>}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <figure className="flex flex-col border border-brand-navy/12 bg-white p-9 shadow-[0_4px_20px_rgba(0,41,71,0.05)]">
      <div className="flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-6 flex-1 text-[16px] leading-relaxed text-foreground/85">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-9 flex items-center gap-4 border-t border-brand-navy/10 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold uppercase text-white">
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-brand-navy">
            {name}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">
            {role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────────── 05 CONTACT ───────────────────────────── */

function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-brand-navyDeep px-5 py-24 md:px-10 md:py-32"
    >

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-14 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-20">
        <div>
          <SectionHeader
            number="05"
            eyebrow="Contact"
            title={
              <>
                Got A Question?
                <br />
                <span className="text-primary">Let&rsquo;s Talk.</span>
              </>
            }
            subhead="We respond personally to every athlete and parent — usually within 24 hours."
          />
        </div>

        <form className="flex flex-col gap-3 border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
          <FormField label="Name" placeholder="Full name" />
          <FormField label="Email" type="email" placeholder="you@example.com" />
          <FormField label="Athlete Class" placeholder="e.g. 2027" />
          <label className="mt-1 flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">
              Message
            </span>
            <textarea
              rows={4}
              placeholder="Tell us a bit about your goals..."
              className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/35 outline-none ring-primary/50 focus:ring-2"
            />
          </label>
          <Button
            type="submit"
            size="lg"
            className="mt-2 h-14 rounded-none bg-primary text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.45)] hover:bg-primary/90"
          >
            Send Message
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
            Or email <a href="mailto:jmiller@qbelite.com" className="text-primary hover:underline">jmiller@qbelite.com</a>
          </p>
        </form>
      </div>
    </section>
  );
}

function FormField({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none ring-primary/50 focus:ring-2"
      />
    </label>
  );
}

/* ───────────────────────────── 06 SOCIAL ───────────────────────────── */

/**
 * Confirm handles / URLs with Justin. Footer keeps a smaller social-icon
 * row for redundancy; this section is the explicit "follow us" CTA.
 */
type SocialPlatform = {
  name: string;
  handle: string;
  href: string;
  icon: typeof Instagram;
  blurb: string;
};

const SOCIALS: SocialPlatform[] = [
  {
    name: "Instagram",
    handle: "@qbelite",
    href: "https://www.instagram.com/qbelite/",
    icon: Instagram,
    blurb: "Camp footage, athlete signing days, training cues.",
  },
  {
    name: "YouTube",
    handle: "@QBElite",
    href: "https://www.youtube.com/@qbelite",
    icon: Youtube,
    blurb: "Full coach breakdowns, film studies, and highlight reels.",
  },
  {
    name: "Facebook",
    handle: "QB Elite",
    href: "https://www.facebook.com/qbelite",
    icon: Facebook,
    blurb: "Event announcements and community updates.",
  },
];

function SocialFollowSection() {
  return (
    <section
      id="social"
      className="relative overflow-hidden bg-brand-graphite px-5 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/18 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#0693e3]/15 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="06"
          eyebrow="Stay Connected"
          title={
            <>
              Follow{" "}
              <span className="text-primary">The Journey.</span>
            </>
          }
          subhead="Camp footage, signing-day moments, and coaching cues drop on our feeds every week."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SOCIALS.map((s) => (
            <SocialCard key={s.name} platform={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialCard({ platform }: { platform: SocialPlatform }) {
  const Icon = platform.icon;
  return (
    <Link
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden border border-white/12 bg-white/[0.04] p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-white/[0.08]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/55">
        {platform.name}
      </p>
      <p className="mt-1 font-display text-[30px] uppercase tracking-tight text-white md:text-[34px]">
        {platform.handle}
      </p>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-white/65">
        {platform.blurb}
      </p>

      <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
          Follow
        </span>
        <span className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors group-hover:bg-primary">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

