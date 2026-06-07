import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Facebook,
  Instagram,
  Mail,
  Play,
  Quote,
  Smartphone,
  Star,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      <FloatingNav />
      <Hero />
      <FeaturedOnStrip />
      <PillarsSection />
      <PedigreeSection />
      <ByTheNumbers />
      <CreedSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

/* ───────────────────────────── NAV ───────────────────────────── */

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "QB Training", href: "#training" },
  { label: "Camps", href: "#camps" },
  { label: "App", href: "#app" },
  { label: "Shop", href: "#shop" },
  { label: "About", href: "#pedigree" },
];

function FloatingNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1.25rem)] md:px-10">
      <Link href="#top" className="flex items-center gap-2.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 backdrop-blur">
          <Image
            src="/logo.png"
            alt="QB Elite"
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <span className="text-base font-extrabold uppercase tracking-[0.14em] text-white">
          QB Elite
        </span>
      </Link>

      <nav className="hidden items-center gap-0.5 rounded-full bg-white/5 px-1.5 py-1.5 ring-1 ring-white/10 backdrop-blur lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="#contact" className="hidden sm:inline-flex">
        <Button
          size="sm"
          className="h-10 rounded-none bg-primary px-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-md hover:bg-primary/90"
        >
          Train With Us
        </Button>
      </Link>

      <Link
        href="#contact"
        className="inline-flex items-center gap-1 bg-primary px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:hidden"
      >
        Menu
      </Link>
    </header>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[820px] w-full items-center overflow-hidden bg-black md:min-h-[920px]"
    >
      {/* Layered dark backdrop. Swap the gradient for a real hero
          video <video poster=... autoplay muted loop> once captured. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black via-brand-navyDeep to-brand-navy"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 75% 30%, rgba(182,32,37,0.35), transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(0,53,84,0.6), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] gap-12 px-5 pb-24 pt-40 md:grid-cols-[1.2fr_1fr] md:gap-20 md:px-10 md:pb-32 md:pt-48">
        {/* Left — copy + CTA */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              Quarterback Training
            </span>
          </div>

          <h1 className="mt-6 text-[52px] font-black uppercase leading-[0.88] tracking-tight text-white md:text-[88px] lg:text-[104px]">
            Become
            <br />
            <span className="text-primary">Elite.</span>
          </h1>

          <p className="mt-7 max-w-[540px] text-base leading-relaxed text-white/75 md:text-lg">
            Camps, 1:1 training, and the QB Elite app — built around
            mechanics, mindset, and competition. Train where the next
            generation of college and pro quarterbacks train.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link href="#contact">
              <Button
                size="lg"
                className="group h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.45)] hover:bg-primary/90 sm:w-auto"
              >
                Become Elite Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#training">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-none border-white/25 bg-transparent px-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch The Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Right — intro video placeholder */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-navy shadow-[0_40px_100px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-primary/25 via-brand-navy to-black"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.25), transparent 60%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <button
                type="button"
                aria-label="Play intro video"
                className="group flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_60px_rgba(182,32,37,0.65)] transition-transform hover:scale-105"
              >
                <Play className="h-9 w-9 translate-x-0.5 fill-current" />
              </button>
              <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/80">
                Intro · 0:90
              </p>
            </div>
            {/* Red corner accent */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-12 w-1 bg-primary"
            />
            <span
              aria-hidden
              className="absolute left-0 top-0 h-1 w-12 bg-primary"
            />
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
    <section className="relative border-b border-white/10 bg-brand-navyDeep">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-6 px-5 py-8 md:flex-row md:justify-between md:px-10 md:py-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/55">
          Featured On
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-12">
          {outlets.map((o) => (
            <li
              key={o}
              className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/85"
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
    href: "#camps",
    icon: CalendarDays,
  },
  {
    id: "training",
    eyebrow: "1:1 Training",
    title: "QB Training",
    description:
      "Private and group sessions with QB Elite coaches — paired by zip code so you're working with the right coach for your region.",
    cta: "Schedule Your Workout",
    href: "#training",
    icon: Dumbbell,
  },
  {
    id: "app",
    eyebrow: "Online Training",
    title: "QB Elite App",
    description:
      "Daily workouts, classroom film breakdowns, meal plans, and live Huddles — on iPhone, Android, and web. Train anywhere.",
    cta: "Access The App",
    href: "https://qbeliteapp.com",
    icon: Smartphone,
  },
] as const;

function PillarsSection() {
  return (
    <section
      id="pillars"
      className="relative bg-brand-navyDeep px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
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
      <DashedDivider position="bottom" tone="light" />
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
      className="group relative flex flex-col overflow-hidden border border-white/12 bg-gradient-to-br from-white/[0.04] to-transparent p-8 transition-all hover:border-primary/60 hover:bg-white/[0.06]"
    >
      {/* Top accent rail — animates in on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/45">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-8 text-3xl font-black uppercase tracking-tight text-white md:text-[34px]">
        {title}
      </h3>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/65">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
          {cta}
        </span>
        <span className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors group-hover:bg-primary">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

/* ───────────────────────────── 02 PEDIGREE ───────────────────────────── */

const CURRENT_COACHES = ["Justin Miller", "Dustin", "Ty"];
const GUEST_COACHES = [
  "Mark Brunell",
  "Kirk",
  "Kay",
  "Max",
  "Jaren",
  "Brandon",
];
const PEDIGREE_LOGOS = [
  "BYU",
  "Utah",
  "Utah State",
  "Boise State",
  "USC",
  "Oregon",
  "Texas",
  "NFL",
  "XFL",
  "CFL",
];

function PedigreeSection() {
  return (
    <section
      id="pedigree"
      className="relative bg-black px-5 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="02"
          eyebrow="The Pedigree"
          title={
            <>
              Built By QBs Who&rsquo;ve
              <br />
              <span className="text-primary">Been There.</span>
            </>
          }
          subhead="QB Elite is led by current and former college and pro quarterbacks. Every drill, every cue, every film clip comes from coaches who've lived the position — not theory."
        />

        {/* Pedigree logo strip */}
        <div className="mt-12 border-y border-white/10 py-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
            {PEDIGREE_LOGOS.map((logo) => (
              <li
                key={logo}
                className="text-[18px] font-black uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white"
              >
                {logo}
              </li>
            ))}
          </ul>
        </div>

        {/* Coach roster */}
        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
          <CoachColumn
            title="Current Coaches"
            names={CURRENT_COACHES}
            blurb="Full-time QB Elite staff — running camps, leading 1:1 sessions, and building the app curriculum every week."
          />
          <CoachColumn
            title="Guest Coaches"
            names={GUEST_COACHES}
            blurb="Pro and college veterans who join camps and film sessions throughout the year to share what they've learned at the highest level."
          />
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link href="#about-detail">
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
    </section>
  );
}

function CoachColumn({
  title,
  names,
  blurb,
}: {
  title: string;
  names: string[];
  blurb: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
          {title}
        </p>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
          {names.length} Total
        </span>
      </div>
      <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-white/65">
        {blurb}
      </p>
      <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3">
        {names.map((n) => (
          <li
            key={n}
            className="flex items-center gap-2.5 border-b border-white/8 pb-2.5 text-[14px] font-extrabold uppercase tracking-[0.08em] text-white"
          >
            <ChevronRight className="h-3.5 w-3.5 text-primary" />
            {n}
          </li>
        ))}
      </ul>
    </div>
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
    <section className="relative overflow-hidden bg-brand-navy px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="03"
          eyebrow="By The Numbers"
          title={
            <>
              The Work
              <br />
              <span className="text-primary">Speaks Loud.</span>
            </>
          }
        />

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-white/10 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-brand-navy p-8 md:p-10"
            >
              <p className="text-5xl font-black tracking-tight text-white md:text-[64px]">
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

/* ───────────────────────────── CREED ───────────────────────────── */

function CreedSection() {
  return (
    <section className="relative bg-brand-navyDeep px-5 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
        <Quote className="h-10 w-10 fill-primary text-primary" />
        <p className="mt-8 text-[28px] font-black uppercase leading-[1.15] tracking-tight text-white md:text-[44px] lg:text-[54px]">
          Talent gets you noticed.
          <br />
          <span className="text-primary">Work gets you drafted.</span>
        </p>
        <p className="mt-7 max-w-[520px] text-sm font-bold uppercase tracking-[0.18em] text-white/55">
          — The QB Elite Creed
        </p>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

/* ───────────────────────────── 04 TESTIMONIALS ───────────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "QB Elite turned my mechanics around in a single camp. I went into my junior year throwing more confidently than I ever have.",
    name: "Caleb R.",
    role: "Class of 2027 · UT",
  },
  {
    quote:
      "Justin and the team treat every kid like they're the next D1 starter. The app keeps us on track between camps — it's a complete system.",
    name: "Megan T.",
    role: "Parent · Class of 2026",
  },
  {
    quote:
      "Working with QBE coaches gave me reps I couldn't get anywhere else. The film breakdowns alone are worth the price of admission.",
    name: "Drew K.",
    role: "Class of 2025 · committed",
  },
] as const;

function TestimonialsSection() {
  return (
    <section className="relative bg-brand-navyDeep px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="04"
          eyebrow="Hear From Our Athletes"
          title={
            <>
              Results That
              <br />
              <span className="text-primary">Speak For Themselves.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <figure className="flex flex-col bg-brand-navyDeep p-9">
      <div className="flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-6 flex-1 text-[16px] leading-relaxed text-white/85">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-9 flex items-center gap-4 border-t border-white/10 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold uppercase text-white">
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-white">
            {name}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
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
      className="relative overflow-hidden bg-black px-5 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-navy/40 blur-[140px]"
      />

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

/* ───────────────────────────── FOOTER ───────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-navyDeep px-5 pt-20 text-white md:px-10">
      <div className="mx-auto grid w-full max-w-[1320px] gap-12 md:grid-cols-[1.4fr_0.9fr_0.9fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5 shadow-md">
              <Image
                src="/logo.png"
                alt="QB Elite"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-base font-extrabold uppercase tracking-[0.14em] text-white">
              QB Elite
            </span>
          </div>
          <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-white/65">
            Quarterback training built by QBs who&rsquo;ve played at the
            highest level.
          </p>
          <div className="mt-7 flex items-center gap-2">
            <SocialIcon icon={Instagram} href="#" label="Instagram" />
            <SocialIcon icon={Youtube} href="#" label="YouTube" />
            <SocialIcon icon={Facebook} href="#" label="Facebook" />
          </div>
        </div>

        <FooterColumn
          title="Train"
          links={[
            { label: "QB Training", href: "#training" },
            { label: "Camps", href: "#camps" },
            { label: "QB Elite App", href: "https://qbeliteapp.com" },
            { label: "Shop", href: "#shop" },
          ]}
        />
        <FooterColumn
          title="About"
          links={[
            { label: "Coaches", href: "#pedigree" },
            { label: "Alumni", href: "#pedigree" },
            { label: "Sponsors", href: "#pedigree" },
            { label: "Contact", href: "#contact" },
          ]}
        />

        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
            Newsletter
          </p>
          <p className="mt-3 text-sm text-white/65">
            Camp schedules, training tips, and roster news — straight to
            your inbox.
          </p>
          <form className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 flex-1 border border-white/15 bg-white/5 px-4 text-sm text-white placeholder-white/40 outline-none ring-primary/50 focus:ring-2"
            />
            <Button
              type="submit"
              className="h-11 rounded-none bg-primary px-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white hover:bg-primary/90"
            >
              Join
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[1320px] flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45 md:flex-row">
        <p>© {new Date().getFullYear()} Eleven72 Media. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            href="https://qb-elite-launch.web.app/terms-of-service"
            className="hover:text-white"
          >
            Terms
          </Link>
          <Link
            href="https://qb-elite-launch.web.app/privacy-policy"
            className="hover:text-white"
          >
            Privacy
          </Link>
          <Link href="mailto:jmiller@qbelite.com" className="hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  icon: Icon,
  href,
  label,
}: {
  icon: typeof Instagram;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/15 transition-colors hover:bg-primary hover:ring-primary"
    >
      <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
    </Link>
  );
}

/* ───────────────────────────── SHARED BITS ───────────────────────────── */

function SectionHeader({
  number,
  eyebrow,
  title,
  subhead,
}: {
  number: string;
  eyebrow: string;
  title: React.ReactNode;
  subhead?: string;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
      <div className="flex items-start gap-5">
        <span className="font-black leading-none text-white/15 text-[60px] md:text-[84px]">
          {number}
        </span>
        <span className="mt-2 h-px w-16 bg-primary md:mt-4 md:w-20" />
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-[34px] font-black uppercase leading-[1.02] tracking-tight text-white md:text-[56px] lg:text-[64px]">
          {title}
        </h2>
        {subhead && (
          <p className="mt-5 max-w-[640px] text-base leading-relaxed text-white/65 md:text-lg">
            {subhead}
          </p>
        )}
      </div>
    </div>
  );
}

function DashedDivider({
  position,
  tone = "light",
}: {
  position: "top" | "bottom";
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } h-px`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${
          tone === "light" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"
        } 0 8px, transparent 8px 16px)`,
      }}
    />
  );
}
