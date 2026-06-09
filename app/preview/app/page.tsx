import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  ChevronDown,
  Dumbbell,
  Mic,
  Play,
  Smartphone,
  Trophy,
  Users,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

import { PricingTiers } from "./pricing-tiers";

export const metadata = {
  title: "QB Elite App — The Most Comprehensive QB Training Mobile App",
  description:
    "Train like a pro. Lead like a champion. Play with confidence. The QB Elite app — mechanics, film study, weight room, nutrition, and live coach huddles in your pocket.",
};

const APP_STORE_URL = "https://apps.apple.com/us/app/qb-elite/id6753002596";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.quarterbackelite.app";
const REGISTER_URL = "/register";

/**
 * /preview/app — App tab on the new marketing site. Mirrors the
 * content at qbelite.com/app verbatim where possible, restyled in
 * the QB Elite brand format (Anton display, navy / graphite / white
 * ladder, red accents, numbered sections).
 *
 * Sections, top to bottom:
 *   hero
 *   01 Mission · "Develop The Complete Quarterback"
 *   02 Our Approach · 3-card overview (Trainings · Weight Room +
 *      Nutrition · The Huddle)
 *   03 What You Get Each Week · 4 bullets
 *   04 Weight Room + Nutrition · long-form 2-col
 *   05 The Huddle · long-form + topic bullets
 *   06 Meet Your Team · Justin, Dustin, Ty
 *   07 Pick Your Training Level · 3-tier pricing w/ monthly|yearly
 *   08 Testimonials · 6 athlete pull-quotes
 *   09 FAQ
 *   final CTA · trial + native store buttons
 */
export default function AppPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <Mission />
      <Approach />
      <WeeklyTrainings />
      <WeightRoomNutrition />
      <TheHuddle />
      <MeetYourTeam />
      <Pricing />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </main>
  );
}

/* ─────────────────────────────── HERO ─────────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] w-full items-end overflow-hidden bg-brand-navy md:min-h-[720px]">
      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] gap-12 px-5 pb-16 pt-40 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:px-10 md:pb-24 md:pt-48">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              QB Elite App
            </span>
          </div>

          <h1 className="mt-6 font-display text-[48px] uppercase leading-[0.94] tracking-tight text-white md:text-[88px] lg:text-[104px]">
            The Most Comprehensive
            <br />
            <span className="text-primary">QB Training App.</span>
          </h1>

          <p className="mt-7 max-w-[560px] text-base leading-relaxed text-white/80 md:text-lg">
            Train like a pro. Lead like a champion. Play with confidence.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link href={REGISTER_URL}>
              <Button
                size="lg"
                className="group h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90 sm:w-auto"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-none border-white/30 bg-white/5 px-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/15 hover:text-white sm:w-auto"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StoreButton store="apple" />
            <StoreButton store="google" />
          </div>
        </div>

        {/* Right — phone-frame placeholder */}
        <div className="relative hidden md:block">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[40px] bg-brand-navyDeep ring-1 ring-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-primary/25 via-brand-navy to-black"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-7 text-center text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <Smartphone className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="mt-6 font-display text-[24px] uppercase leading-tight tracking-tight text-white">
                Your Daily
                <br />
                <span className="text-primary">Training Plan.</span>
              </p>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white/65">
                In Your Pocket
              </p>
            </div>
            <span aria-hidden className="absolute left-0 top-0 h-12 w-1 bg-primary" />
            <span aria-hidden className="absolute left-0 top-0 h-1 w-12 bg-primary" />
          </div>
        </div>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

function StoreButton({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  const href = isApple ? APP_STORE_URL : PLAY_STORE_URL;
  const label = isApple ? "App Store" : "Google Play";
  const sub = isApple ? "Download on the" : "Get it on";
  const Icon = isApple ? Apple : Play;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-12 items-center gap-3 border border-white/25 bg-white/5 px-4 backdrop-blur transition-colors hover:border-primary/60 hover:bg-white/10"
    >
      <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
      <span className="flex flex-col text-left leading-none">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
          {sub}
        </span>
        <span className="mt-0.5 font-display text-[16px] uppercase tracking-tight text-white">
          {label}
        </span>
      </span>
    </Link>
  );
}

/* ────────────────────────────── 01 MISSION ────────────────────────────── */

function Mission() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="01"
          eyebrow="Our Mission"
          title={
            <>
              Develop The Complete{" "}
              <span className="text-primary">Quarterback.</span>
            </>
          }
          subhead="Our membership empowers young athletes to excel both on and off the field through comprehensive mental, physical, mechanical, and leadership development."
        />

        <div className="mt-12 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div className="border-l-4 border-primary pl-7">
            <p className="font-display text-[28px] uppercase leading-tight tracking-tight text-brand-navy md:text-[36px]">
              The QB Elite App goes{" "}
              <span className="text-primary">beyond drills.</span>
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/75 md:text-base">
              Our training develops the entire quarterback — mechanics,
              footwork, film study, decision-making, leadership, strength,
              nutrition, and mindset. So athletes are prepared for game
              day and for life beyond football.
            </p>
            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              #BecomeElite
            </p>
          </div>

          <div className="border-l-4 border-primary pl-7">
            <p className="font-display text-[28px] uppercase leading-tight tracking-tight text-brand-navy md:text-[36px]">
              Progressive &amp;{" "}
              <span className="text-primary">personalized.</span>
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/75 md:text-base">
              Whether you&rsquo;re building fundamentals or training at an
              elite level, you can choose structured weekly programs or
              progress into coach-led film study, live group sessions,
              and fully personalized one-on-one coaching.
            </p>
            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              #BecomeElite
            </p>
          </div>
        </div>

        <div className="mt-16 border border-brand-navy/12 bg-brand-navy p-8 text-white md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
                Accountability That Drives Results
              </p>
              <p className="mt-3 font-display text-[28px] uppercase leading-tight tracking-tight text-white md:text-[36px]">
                Track progress. Earn{" "}
                <span className="text-primary">consistency.</span>
              </p>
              <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/80">
                Live huddles with coaches, college and pro athletes, and
                industry experts. QB Elite turns daily work into measurable
                growth — and measurable growth into confidence and
                opportunity.
              </p>
            </div>
            <Link href={REGISTER_URL}>
              <Button
                size="lg"
                className="h-14 rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── 02 APPROACH ────────────────────────────── */

const APPROACH = [
  {
    icon: Dumbbell,
    title: "Progressive Trainings",
    description:
      "Weekly focused trainings with everything a QB could possibly need — mechanics, drills, weight room instruction, progressions and reads, leadership on and off the field, and more.",
    anchor: "#weekly-trainings",
  },
  {
    icon: Utensils,
    title: "Weight Room & Nutrition",
    description:
      "Every athlete should know the basics and have instruction on how to fuel and strengthen their body — including recovery — to get an edge on the competition and increase longevity in the sport.",
    anchor: "#weight-room",
  },
  {
    icon: Mic,
    title: "The Huddle",
    description:
      "Video calls athletes join live (or watch later) for fresh, relevant instruction. Higher tiers include film breakdowns; motivational + instructional calls for all programs.",
    anchor: "#huddle",
  },
] as const;

function Approach() {
  return (
    <section
      id="approach"
      className="relative bg-brand-graphite px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/18 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="02"
          eyebrow="Our Approach"
          title={
            <>
              Three Layers Of{" "}
              <span className="text-primary">Development.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {APPROACH.map((a) => (
            <Link
              key={a.title}
              href={a.anchor}
              className="group relative flex flex-col overflow-hidden border border-white/12 bg-white/[0.04] p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-white/[0.08]"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
              />
              <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
                <a.icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h3 className="mt-7 font-display text-[28px] uppercase leading-tight tracking-tight text-white md:text-[32px]">
                {a.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-white/70">
                {a.description}
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
                  Learn More
                </span>
                <span className="flex h-9 w-9 items-center justify-center bg-white/10 text-white transition-colors group-hover:bg-primary">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 03 WEEKLY TRAININGS ────────────────────────── */

const WEEKLY_PILLARS = [
  {
    icon: Dumbbell,
    title: "Mechanics & Drills",
    description:
      "Deep dive into a single QB mechanic for the week, supported by drills to give you the reps necessary for elite muscle memory formation.",
  },
  {
    icon: Brain,
    title: "Defensive Fluency",
    description:
      "Learn and master coverages, blitzes, fronts, defensive terminology, and scheme.",
  },
  {
    icon: BookOpen,
    title: "Offensive Mastery",
    description:
      "Learning an offense — reads, progressions, concepts, key/conflict defenders. Run game and blocking schemes included.",
  },
  {
    icon: Trophy,
    title: "Win The Weekend",
    description:
      "Develop essential QB intangibles and leadership skills to refine your game on and off the field.",
  },
] as const;

function WeeklyTrainings() {
  return (
    <section
      id="weekly-trainings"
      className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="03"
          eyebrow="Weekly Trainings"
          title={
            <>
              What You Get{" "}
              <span className="text-primary">Every Week.</span>
            </>
          }
          subhead="Four focused training blocks land in the app every week. Show up consistent and elite skill-formation takes care of itself."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {WEEKLY_PILLARS.map((p) => (
            <article
              key={p.title}
              className="flex border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <div className="mr-6 flex h-14 w-14 shrink-0 items-center justify-center bg-primary text-white">
                <p.icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display text-[26px] uppercase leading-tight tracking-tight text-brand-navy md:text-[30px]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground/70 md:text-[15px]">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── 04 WEIGHT ROOM + NUTRITION ────────────────────── */

function WeightRoomNutrition() {
  return (
    <section
      id="weight-room"
      className="relative bg-brand-navy px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="04"
          eyebrow="Weight Room + Nutrition"
          title={
            <>
              Build The Body{" "}
              <span className="text-primary">Behind The Arm.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <article className="border border-white/12 bg-white/[0.04] p-9">
            <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
              <Dumbbell className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h3 className="mt-7 font-display text-[32px] uppercase leading-tight tracking-tight text-white md:text-[40px]">
              Weight Room
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75">
              The QB Elite weight room program is designed specifically
              for quarterbacks — building strength, explosiveness, mobility,
              and durability without sacrificing throwing performance.
              Athletes get clear instruction on proper movement patterns,
              position-specific lifts, and structured workout splits that
              support on-field performance while reducing injury risk.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              Just as important: QB Elite emphasizes recovery — teaching
              athletes how to optimize rest, mobility, and regeneration so
              they can train consistently, stay healthy through long
              seasons, and extend their longevity in the sport.
            </p>
          </article>

          <article className="border border-white/12 bg-white/[0.04] p-9">
            <div className="flex h-14 w-14 items-center justify-center bg-primary text-white">
              <Utensils className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h3 className="mt-7 font-display text-[32px] uppercase leading-tight tracking-tight text-white md:text-[40px]">
              Nutrition
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75">
              QB Elite nutrition training gives athletes the knowledge and
              structure they need to fuel performance, recovery, and
              long-term development — without sacrificing enjoyment or
              feeling restricted. Quarterbacks learn the fundamentals of
              performance-based nutrition: how to eat for training days,
              game days, and recovery.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              With practical education, recipes, and meal guidance,
              athletes build sustainable habits that support strength,
              focus, energy, and durability — proving that eating
              &ldquo;healthy&rdquo; can still be satisfying, flexible,
              and realistic.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── 05 HUDDLE ────────────────────────────── */

const HUDDLE_TOPICS = [
  "Leadership on and off the field",
  "Balancing life as a student-athlete",
  "Dealing with burnout and mental fatigue",
  "Recovery and longevity (inspired by careers like Tom Brady's)",
  "Mental toughness and confidence under pressure",
  "Life in college and professional football",
  "Group film breakdowns and game analysis (higher tiers)",
];

function TheHuddle() {
  return (
    <section
      id="huddle"
      className="relative bg-brand-graphite px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="05"
          eyebrow="The Huddle"
          title={
            <>
              Direct Access To{" "}
              <span className="text-primary">Elite Knowledge.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <div>
            <p className="text-[15px] leading-relaxed text-white/80 md:text-[16px]">
              The Huddle is the heartbeat of the QB Elite community —
              bringing athletes direct access to coaches, experts, and
              elite performers through live and on-demand video sessions.
              These conversations go beyond X&rsquo;s and O&rsquo;s,
              covering the mental, physical, and personal sides of
              quarterback development.
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-white/80 md:text-[16px]">
              Higher tiers also gain access to group film breakdowns with
              coach-led feedback and Q&amp;A. Together, The Huddle gives
              quarterbacks ongoing access to elite knowledge, mentorship,
              and perspective — helping them grow as athletes, leaders,
              and people.
            </p>
          </div>

          <article className="border border-white/12 bg-white/[0.04] p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              Topics May Include
            </p>
            <ul className="mt-5 space-y-3">
              {HUDDLE_TOPICS.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 border-b border-white/8 pb-3 text-[14px] leading-snug text-white/85 last:border-b-0 last:pb-0"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── 06 TEAM ────────────────────────────── */

const TEAM = [
  {
    name: "Justin Miller",
    role: "Director of QB Elite App",
    bio: "GFL League MVP 2025 and holds multiple passing and touchdown records playing QB for Southern Utah University. Weightlifting and nutrition coach.",
    photo: "/coaches/justin_miller.webp",
  },
  {
    name: "Dustin Smith",
    role: "QB Elite Founder",
    bio: "Founder of QB Elite along with Ty Detmer. Over 15 years teaching and training elite quarterbacks and wide receivers. Considered by many as one of the top QB instructors in the country.",
    photo: "/coaches/dustin_smith.jpg",
  },
  {
    name: "Ty Detmer",
    role: "QB Elite Co-Founder",
    bio: "Co-Founder of QB Elite. College Football Offensive Coordinator and former NFL QB. Won the Heisman Trophy in 1990 while playing quarterback for Brigham Young University.",
    photo: "/coaches/ty_detmer.jpg",
  },
] as const;

function MeetYourTeam() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="06"
          eyebrow="Meet Your Team"
          title={
            <>
              Built By QBs.{" "}
              <span className="text-primary">For QBs.</span>
            </>
          }
          subhead="The coaches behind the curriculum — same staff that runs in-person camps and 1:1 training."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="flex flex-col overflow-hidden border border-brand-navy/12 bg-white shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-navyDeep">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-12 w-1.5 bg-primary"
                />
              </div>
              <div className="p-7">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
                  {member.role}
                </p>
                <h3 className="mt-2 font-display text-[28px] uppercase leading-tight tracking-tight text-brand-navy md:text-[32px]">
                  {member.name}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-foreground/70">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── 07 PRICING ────────────────────────────── */

function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-brand-navy px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="07"
          eyebrow="Pick Your Training Level"
          title={
            <>
              Pricing That Scales{" "}
              <span className="text-primary">With You.</span>
            </>
          }
          subhead="Three tiers. Start self-directed, scale into coach-led group sessions, or go full personalized with a dedicated 1:1 coach."
        />

        <div className="rounded-none bg-white px-5 py-12 text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:px-10 md:py-16 mt-14">
          <PricingTiers />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 08 TESTIMONIALS ─────────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "QB Elite makes training way easier to follow than trying to piece things together from random videos. I like that the workouts are short, clear, and actually help me know what to focus on each week. The QB drills and mechanics videos have helped me feel more confident at practice.",
    name: "Tyler M.",
    role: "8th Grade Quarterback",
  },
  {
    quote:
      "This app feels like having a real plan instead of guessing what I should be working on. The film breakdowns, leadership content, and daily training sections are probably my favorite parts. I've already started noticing better footwork, better reads, and more confidence.",
    name: "Jordan R.",
    role: "Freshman QB",
  },
  {
    quote:
      "What I love most is that QB Elite is not just about throwing. It covers mindset, nutrition, workouts, leadership, and how to improve on and off the field. It makes me feel like I'm training like a serious athlete instead of just doing drills here and there.",
    name: "Mason T.",
    role: "JV Quarterback",
  },
  {
    quote:
      "The structure of this app is what sets it apart. Having mechanics, drills, film study, weight room work, and progress tracking all in one place is a huge advantage. The huddles and coaching content make it feel like you're getting access to way more than a normal training app.",
    name: "Ethan B.",
    role: "Varsity Quarterback",
  },
  {
    quote:
      "I wish I had something like QB Elite a couple years ago. The recruiting and leadership side is a big deal, and the training is actually built for quarterbacks instead of generic football workouts. It helps you stay consistent and gives you a roadmap to keep improving.",
    name: "Caleb S.",
    role: "Senior High School QB",
  },
  {
    quote:
      "QB Elite does a great job combining skill development with everything else quarterbacks need to succeed. The film breakdowns, weekly training, and position-specific workouts are all really useful, but I also like the focus on mindset and leadership. It feels built by people who actually understand the position.",
    name: "Dylan P.",
    role: "College Quarterback",
  },
] as const;

function Testimonials() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="08"
          eyebrow="What Athletes Are Saying"
          title={
            <>
              Real Reviews From{" "}
              <span className="text-primary">Real QBs.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <Users className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <blockquote className="mt-5 flex-1 text-[14px] leading-relaxed text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-brand-navy/10 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-extrabold uppercase text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-brand-navy">
                    {t.name}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/50">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 09 FAQ ─────────────────────────────── */

const FAQ = [
  {
    q: "Is the QB Elite App free to download?",
    a: "Yes — download is free and includes access to select training content. From there, you can choose the program that fits your goals and level of play.",
  },
  {
    q: "Which platforms is the QB Elite App available on?",
    a: "The QB Elite App is available on iOS and Android, and works as a full web app on any modern browser (Mac, Windows, Chromebook).",
  },
  {
    q: "Which training program is right for me?",
    a: "Our training is built to meet every quarterback where they are while developing elite-level fundamentals. The Starter is the most self-directed program for guidance on weight training and nutrition. Each successive level adds more structure, coaching, and personalization to help you reach your full potential.",
  },
  {
    q: "How do I schedule in-person training?",
    a: "In-person training can be scheduled directly through QB Elite by contacting our team or registering for available sessions and camps listed in the app or on our website.",
  },
];

function FaqSection() {
  return (
    <section className="relative bg-brand-graphite px-5 py-24 text-white md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHeader
          number="09"
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="text-primary">Answered.</span>
            </>
          }
        />

        <div className="mt-14 space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border border-white/12 bg-white/[0.04] p-6 transition-colors hover:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <span className="font-display text-[20px] uppercase leading-tight tracking-tight text-white md:text-[24px]">
                  {item.q}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-white transition-transform group-open:rotate-180">
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </summary>
              <p className="mt-5 text-[15px] leading-relaxed text-white/75">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────── FINAL CTA ────────────────────────────── */

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
            Try It Free
          </p>
          <h2 className="mt-3 font-display text-[40px] uppercase leading-[1.02] tracking-tight text-white md:text-[64px]">
            Become Elite{" "}
            <span className="text-primary">Starts Today.</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-white/75 md:text-lg">
            7-day free trial, cancel anytime. Same login on iPhone,
            Android, and the web.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link href={REGISTER_URL}>
            <Button
              size="lg"
              className="h-14 rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 border border-white/25 bg-white/5 px-5 hover:border-primary/60"
            >
              <Apple className="h-5 w-5 text-white" strokeWidth={1.75} />
              <span className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
                  Download
                </span>
                <span className="font-display text-[14px] uppercase tracking-tight text-white">
                  App Store
                </span>
              </span>
              <ArrowUpRight className="ml-2 h-4 w-4 text-white/45" />
            </Link>
            <Link
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 border border-white/25 bg-white/5 px-5 hover:border-primary/60"
            >
              <Play className="h-5 w-5 text-white" strokeWidth={1.75} />
              <span className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">
                  Get it on
                </span>
                <span className="font-display text-[14px] uppercase tracking-tight text-white">
                  Google Play
                </span>
              </span>
              <ArrowUpRight className="ml-2 h-4 w-4 text-white/45" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
