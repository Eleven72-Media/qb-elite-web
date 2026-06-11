import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  GraduationCap,
  Quote,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About QB Elite — Coaches, Alumni, Story | QB Elite",
  description:
    "Meet the QB Elite coaching staff, see where our alumni play, and learn the philosophy that drives the program.",
};

/**
 * /preview/about — About Us tab. Per Justin's brief:
 *   "About us — coaches (current and then previous), alumni and
 *   schools/team, get short personal messages from people"
 *
 * Page structure:
 *   hero
 *   01 our story / mission (brand-guide voice)
 *   02 coaching staff (current + guest)
 *   03 alumni (Division I + non-D1 + pro teams)
 *   04 testimonial pull-quotes (personal messages)
 *   05 final CTA
 */
export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <OurStory />
      <Coaches />
      <Alumni />
      <PersonalMessages />
      <FinalCta />
    </main>
  );
}

/* ─────────────────────────────── HERO ─────────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate flex min-h-[560px] w-full items-end overflow-hidden bg-brand-navy md:min-h-[640px]">
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
            About QB Elite
          </span>
        </div>
        <h1 className="mt-6 font-display text-[56px] uppercase leading-[0.92] tracking-tight text-white md:text-[104px] lg:text-[128px]">
          Built By QBs.
          <br />
          <span className="text-primary">For QBs.</span>
        </h1>
        <p className="mt-7 max-w-[640px] text-base leading-relaxed text-white/80 md:text-lg">
          QB Elite exists to develop the complete quarterback —
          mechanics, film study, football IQ, and leadership. Meet the
          coaches, the alumni, and the philosophy.
        </p>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

/* ──────────────────────────── 01 OUR STORY ──────────────────────────── */

const CORE_VALUES = [
  {
    title: "Discipline & Preparation",
    description:
      "Elite QBs are built through consistent work. We coach the daily habits — film, fundamentals, training with purpose.",
  },
  {
    title: "Football Intelligence",
    description:
      "Read defenses, make fast decisions, play with awareness. The mental side is what separates good from elite.",
  },
  {
    title: "Leadership",
    description:
      "QBs lead their teams. We coach the cadence, communication, and accountability that make teammates better.",
  },
  {
    title: "Competitive Excellence",
    description:
      "Push past average. Embrace hard work. Continuously improve your skills and mindset every single day.",
  },
] as const;

function OurStory() {
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
          subhead="Unlike general football programs that train arms or athleticism, QB Elite develops the four things that actually win Friday nights."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CORE_VALUES.map((v) => (
            <article
              key={v.title}
              className="flex flex-col border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
                Core Value
              </span>
              <h3 className="mt-3 font-display text-[24px] uppercase leading-tight tracking-tight text-brand-navy">
                {v.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/70">
                {v.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── 02 COACHES ──────────────────────────── */

type Coach = { name: string; role: string; photo: string };

const COACHING_STAFF: Coach[] = [
  {
    name: "Dustin Smith",
    role: "Owner · QB Elite Coach",
    photo: "/coaches/dustin_smith.png",
  },
  {
    name: "Ty Detmer",
    role: "14-Yr NFL QB · Heisman Trophy Winner",
    photo: "/coaches/ty_detmer.png",
  },
  {
    name: "Justin Miller",
    role: "QB Elite Coach",
    photo: "/coaches/justin_miller.png",
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

function Coaches() {
  return (
    <section
      id="coaches"
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
        <SectionHeader
          number="02"
          eyebrow="Our Coaches"
          title={
            <>
              Coaches Who&rsquo;ve
              <br />
              <span className="text-primary">Been There.</span>
            </>
          }
          subhead="Every cue, every drill, every film clip comes from coaches who've lived the position. NFL MVPs, Heisman winners, 15-year pros — they all coach here."
        />

        <div className="mx-auto mt-16 max-w-2xl">
          <CoachTierHeader title="Coaching Staff" count={COACHING_STAFF.length} />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
            {COACHING_STAFF.map((c) => (
              <CoachCard key={c.name} coach={c} featured />
            ))}
          </div>
        </div>

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

function CoachCard({
  coach,
  featured = false,
}: {
  coach: Coach;
  featured?: boolean;
}) {
  return (
    <figure className="group relative overflow-hidden border border-white/10 bg-white/[0.03] transition-colors hover:border-primary/50">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-navyDeep">
        <Image
          src={coach.photo}
          alt={coach.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/55 to-transparent"
        />
        {featured && (
          <span aria-hidden className="absolute left-0 top-0 h-8 w-1 bg-primary" />
        )}
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-[18px] uppercase leading-tight tracking-tight text-white">
          {coach.name}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
          {coach.role}
        </p>
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────── 03 ALUMNI ──────────────────────────── */

const ALUMNI_COLLEGES = [
  "Adams State",
  "Boise State",
  "BYU",
  "Hawaii",
  "Midland",
  "Montana",
  "Ole Miss",
  "Oklahoma",
  "Snow College",
  "SUU",
  "Texas A&M",
  "USC",
  "Utah",
  "Utah State",
  "Utah Tech",
  "Weber State",
  "Western Kentucky",
];

const ALUMNI_PROS = [
  "Alouettes",
  "Broncos",
  "Browns",
  "Cardinals",
  "Commanders",
  "Eagles",
  "Falcons",
  "49ers",
  "Giants",
  "Jaguars",
  "Jets",
  "Lions",
  "Packers",
  "Raiders",
  "Rams",
  "Saints",
  "Seahawks",
  "Vikings",
];

function Alumni() {
  return (
    <section
      id="alumni"
      className="relative bg-brand-graphite px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="03"
          eyebrow="QB Elite Alumni"
          title={
            <>
              Where Our QBs{" "}
              <span className="text-primary">Play Now.</span>
            </>
          }
          subhead="500+ quarterbacks have trained at QB Elite. They've gone on to play at every level — D1 starters, NFL roster guys, and the next generation working their way up."
        />

        <div className="mt-14 grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-[260px]">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" strokeWidth={1.75} />
              <p className="font-display text-[28px] uppercase tracking-tight text-brand-navy md:text-[32px]">
                Colleges
              </p>
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/70">
              {ALUMNI_COLLEGES.length} programs across Division I, JUCO, NAIA,
              and Division II.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {ALUMNI_COLLEGES.map((c) => (
              <li
                key={c}
                className="flex items-center gap-2 border-b border-brand-navy/10 pb-2.5 text-[14px] font-extrabold uppercase tracking-[0.06em] text-brand-navy"
              >
                <ChevronRight className="h-3.5 w-3.5 text-primary" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="flex flex-col gap-4 md:max-w-[260px]">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary" strokeWidth={1.75} />
              <p className="font-display text-[28px] uppercase tracking-tight text-brand-navy md:text-[32px]">
                Pro Teams
              </p>
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/70">
              {ALUMNI_PROS.length} pro franchises across the NFL and CFL where
              alumni and QB Elite coaches have played.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {ALUMNI_PROS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 border-b border-brand-navy/10 pb-2.5 text-[14px] font-extrabold uppercase tracking-[0.06em] text-brand-navy"
              >
                <ChevronRight className="h-3.5 w-3.5 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 04 PERSONAL MESSAGES ─────────────────────────── */

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
  {
    quote:
      "I've been around football my entire career as a player and a coach. Nobody coaches QBs better than Dustin Smith and the QB Elite program.",
    name: "Brandon Doman",
    role: "Former NFL QB · D1 Offensive Coordinator",
  },
  {
    quote:
      "I recommend receiving instruction from Quarterback Elite!",
    name: "Steve Mariucci",
    role: "Former NFL Head Coach",
  },
  {
    quote:
      "Being able to learn from someone as experienced as Ty Detmer is rare. A Heisman trophy! 15 years in the pros! Awesome!",
    name: "Dave",
    role: "QB Elite Parent",
  },
] as const;

function PersonalMessages() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="04"
          eyebrow="In Their Words"
          title={
            <>
              Hear From{" "}
              <span className="text-primary">The Network.</span>
            </>
          }
          subhead="Athletes, parents, and pro coaches who've worked with QB Elite."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <Quote
                className="h-7 w-7 fill-primary text-primary"
                strokeWidth={0}
              />
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85">
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

/* ──────────────────────────── 05 FINAL CTA ──────────────────────────── */

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
            Train With Us
          </p>
          <h2 className="mt-3 font-display text-[40px] uppercase leading-[1.02] tracking-tight text-white md:text-[64px]">
            Ready To{" "}
            <span className="text-primary">Become Elite?</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-white/75 md:text-lg">
            Three paths in: weekly Academy training, a one-day camp, or
            the QB Elite app. Pick what fits and get to work.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link href="/preview/qb-academy">
            <Button
              size="lg"
              className="h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90"
            >
              QB Academy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/preview/camps">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-none border-white/30 bg-white/5 px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white hover:bg-white/15 hover:text-white"
            >
              Browse Camps
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
