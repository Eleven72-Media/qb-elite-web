import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Flame,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

import {
  DashedDivider,
  SectionHeader,
} from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Camps — Upcoming QB Elite Camps | QB Elite",
  description:
    "QB Elite hosts skills camps across Utah and the Mountain West. Multiple camps per weekend — pick the closest to you and secure your spot.",
};

/**
 * /preview/camps — Camps Tab. Per Justin's brief: push the camps,
 * always show MULTIPLE camps per day (single-camp days "look
 * unprofessional"). Page mirrors the flow chart's Camps Tab branch —
 * hero → structure → date-grouped schedule (multi-camp days) →
 * why-camp pitch → CTA.
 *
 * Camp data is placeholder until Justin sends real dates. Each entry
 * stays self-contained so we can swap a static array for a Supabase
 * query later without restructuring the UI.
 */
export default function CampsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-navyDeep text-white">
      <Hero />
      <CampStructure />
      <UpcomingCamps />
      <WhyCamp />
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
            QB Elite Camps
          </span>
        </div>
        <h1 className="mt-6 font-display text-[56px] uppercase leading-[0.92] tracking-tight text-white md:text-[104px] lg:text-[128px]">
          Where The Next
          <br />
          <span className="text-primary">QBs Get Reps.</span>
        </h1>
        <p className="mt-7 max-w-[640px] text-base leading-relaxed text-white/80 md:text-lg">
          One-day skills camps across Utah and the Mountain West.
          Mechanics, footwork, and competition in a small-group setting
          led by the QB Elite staff.
        </p>
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link href="#schedule">
            <Button
              size="lg"
              className="group h-14 w-full rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90 sm:w-auto"
            >
              See Upcoming Camps
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="#structure">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-none border-white/30 bg-white/5 px-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/15 hover:text-white sm:w-auto"
            >
              What To Expect
            </Button>
          </Link>
        </div>
      </div>
      <DashedDivider position="bottom" tone="light" />
    </section>
  );
}

/* ──────────────────────────── 01 STRUCTURE ──────────────────────────── */

const STRUCTURE = [
  {
    icon: Clock,
    title: "One-Day Format",
    description:
      "Camps run 4–6 hours on a Saturday. Show up Friday night ready, walk away Sunday a better quarterback.",
  },
  {
    icon: Users,
    title: "Small-Group Coaching",
    description:
      "Capped attendance per session so every QB gets reps with a coach watching every throw.",
  },
  {
    icon: Trophy,
    title: "Mechanics + Competition",
    description:
      "Morning teaching block on mechanics and footwork. Afternoon competition reps so the work transfers.",
  },
] as const;

function CampStructure() {
  return (
    <section
      id="structure"
      className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="01"
          eyebrow="Camp Structure"
          title={
            <>
              What To <span className="text-primary">Expect.</span>
            </>
          }
          subhead="Every QB Elite camp is built around the same proven structure — teaching block in the morning, competition reps in the afternoon, walk-out cues you can take to practice on Monday."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STRUCTURE.map((s) => (
            <article
              key={s.title}
              className="flex flex-col border border-brand-navy/12 bg-white p-7 shadow-[0_4px_20px_rgba(0,41,71,0.05)]"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
                <s.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 font-display text-[26px] uppercase leading-tight tracking-tight text-brand-navy">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/70">
                {s.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── 02 SCHEDULE ──────────────────────────── */

type Camp = {
  id: string;
  title: string;
  location: string;
  region: string;
  time: string;
  ageGroup: string;
  price: string;
  description: string;
  spotsLeft?: number;
};

type CampDay = {
  date: string;
  weekday: string;
  monthDay: string;
  camps: Camp[];
};

/**
 * Placeholder camp schedule — replace with real dates from Justin.
 * Every day MUST carry at least 2 camps per the brief (single-camp
 * days "look unprofessional"). When backed by Supabase, sort upcoming
 * dates ascending and hide any day with zero published camps rather
 * than ship a single-camp day.
 */
const CAMP_SCHEDULE: CampDay[] = [
  {
    date: "2026-07-11",
    weekday: "Saturday",
    monthDay: "July 11",
    camps: [
      {
        id: "provo-jul11-ms",
        title: "Provo · Middle School",
        location: "Provo High School",
        region: "Provo, UT",
        time: "9:00 AM – 12:00 PM",
        ageGroup: "Grades 6–8",
        price: "$149",
        description:
          "Mechanics-first morning camp for middle school QBs. Footwork, drop steps, basic protections.",
        spotsLeft: 8,
      },
      {
        id: "provo-jul11-hs",
        title: "Provo · High School",
        location: "Provo High School",
        region: "Provo, UT",
        time: "1:30 PM – 5:30 PM",
        ageGroup: "Grades 9–12",
        price: "$199",
        description:
          "Full mechanics + competition format for high school QBs. Coverage recognition added.",
        spotsLeft: 4,
      },
    ],
  },
  {
    date: "2026-07-18",
    weekday: "Saturday",
    monthDay: "July 18",
    camps: [
      {
        id: "slc-jul18",
        title: "Salt Lake City",
        location: "TBD Field House",
        region: "Salt Lake City, UT",
        time: "9:00 AM – 1:00 PM",
        ageGroup: "Grades 6–12",
        price: "$179",
        description:
          "Cross-age camp split into MS and HS groups on the same field.",
      },
      {
        id: "lasvegas-jul18",
        title: "Las Vegas",
        location: "TBD Sports Park",
        region: "Las Vegas, NV",
        time: "9:00 AM – 1:00 PM",
        ageGroup: "Grades 9–12",
        price: "$199",
        description:
          "High school camp for Nevada and Arizona athletes. Limited road-camp spots.",
        spotsLeft: 6,
      },
    ],
  },
  {
    date: "2026-07-25",
    weekday: "Saturday",
    monthDay: "July 25",
    camps: [
      {
        id: "boise-jul25",
        title: "Boise",
        location: "TBD High School",
        region: "Boise, ID",
        time: "9:00 AM – 1:00 PM",
        ageGroup: "Grades 6–12",
        price: "$179",
        description:
          "Idaho regional camp. Mechanics, competition, film walk-through.",
      },
      {
        id: "stgeorge-jul25",
        title: "St. George",
        location: "TBD High School",
        region: "St. George, UT",
        time: "9:00 AM – 1:00 PM",
        ageGroup: "Grades 6–12",
        price: "$179",
        description:
          "Southern Utah regional camp run by the QB Elite road staff.",
      },
    ],
  },
  {
    date: "2026-08-08",
    weekday: "Saturday",
    monthDay: "August 8",
    camps: [
      {
        id: "phoenix-aug8",
        title: "Phoenix",
        location: "TBD Sports Complex",
        region: "Phoenix, AZ",
        time: "8:00 AM – 12:00 PM",
        ageGroup: "Grades 9–12",
        price: "$199",
        description:
          "Arizona regional camp. Early start to beat the heat — bring water.",
        spotsLeft: 12,
      },
      {
        id: "denver-aug8",
        title: "Denver",
        location: "TBD Field House",
        region: "Denver, CO",
        time: "9:00 AM – 1:00 PM",
        ageGroup: "Grades 6–12",
        price: "$199",
        description:
          "Colorado regional. Full QB Elite mechanics curriculum + competition.",
      },
    ],
  },
];

function UpcomingCamps() {
  return (
    <section
      id="schedule"
      className="relative bg-brand-graphite px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/18 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1320px]">
        <SectionHeader
          number="02"
          eyebrow="Upcoming Camps"
          title={
            <>
              Pick Your <span className="text-primary">Date.</span>
            </>
          }
          subhead="Multiple camps every weekend — pick the closest one and secure your spot. Spots fill fastest 2–3 weeks out from the date."
        />

        <div className="mt-14 space-y-12">
          {CAMP_SCHEDULE.map((day) => (
            <CampDayBlock key={day.date} day={day} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CampDayBlock({ day }: { day: CampDay }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <CalendarDays className="h-5 w-5 text-primary" strokeWidth={2} />
        <p className="font-display text-[28px] uppercase tracking-tight text-white md:text-[32px]">
          {day.weekday}
          <span className="text-white/55"> · </span>
          {day.monthDay}
        </p>
        <span className="ml-2 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
          {day.camps.length} Camps
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {day.camps.map((camp) => (
          <CampCard key={camp.id} camp={camp} />
        ))}
      </div>
    </div>
  );
}

function CampCard({ camp }: { camp: Camp }) {
  return (
    <article className="group relative flex flex-col overflow-hidden border border-white/12 bg-white/[0.04] p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-white/[0.08]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-[28px] uppercase leading-tight tracking-tight text-white md:text-[32px]">
          {camp.title}
        </h3>
        <div className="shrink-0 text-right">
          <p className="font-display text-[28px] uppercase leading-none tracking-tight text-primary md:text-[32px]">
            {camp.price}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-white/70">
        {camp.description}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-y-3 border-y border-white/10 py-5 text-[12px]">
        <CampMeta icon={MapPin} label="Location">
          {camp.location}
          <span className="block text-white/55">{camp.region}</span>
        </CampMeta>
        <CampMeta icon={Clock} label="Time">
          {camp.time}
        </CampMeta>
        <CampMeta icon={Users} label="Ages">
          {camp.ageGroup}
        </CampMeta>
        <CampMeta icon={Flame} label="Spots">
          {camp.spotsLeft === undefined
            ? "Open"
            : camp.spotsLeft === 0
              ? "Sold Out"
              : `${camp.spotsLeft} left`}
        </CampMeta>
      </dl>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
          Secure Your Spot
        </span>
        <Link
          href="/preview#contact"
          aria-label={`Register for ${camp.title}`}
          className="flex h-10 w-10 items-center justify-center bg-primary text-white transition-transform group-hover:scale-105"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function CampMeta({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/45">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-white">
          {children}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────── 03 WHY CAMP ──────────────────────────── */

const WHY_CAMP = [
  {
    icon: Trophy,
    title: "QB Elite Coaching",
    description:
      "Same coaches who run 1:1 training and the Academy programs. Not contractors, not random local trainers.",
  },
  {
    icon: ShieldCheck,
    title: "Small-Group Cap",
    description:
      "Attendance is capped so you actually get reps with eyes on every throw. No 100-kid free-for-alls.",
  },
  {
    icon: Flame,
    title: "Walk-Out Cues",
    description:
      "Leave with three things you can take to practice on Monday. Real, specific, position-coach-level cues.",
  },
] as const;

function WhyCamp() {
  return (
    <section className="relative bg-white px-5 py-24 text-foreground md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          surface="light"
          number="03"
          eyebrow="Why A QB Elite Camp"
          title={
            <>
              Better Reps. <span className="text-primary">Better Coaches.</span>
            </>
          }
          subhead="One-day camps are everywhere. The difference at QB Elite is who's coaching them and how many kids are in the group."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {WHY_CAMP.map((p) => (
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

/* ──────────────────────────── 04 FINAL CTA ──────────────────────────── */

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
            Don&rsquo;t See A Camp Near You?
          </p>
          <h2 className="mt-3 font-display text-[40px] uppercase leading-[1.02] tracking-tight text-white md:text-[64px]">
            Bring QB Elite{" "}
            <span className="text-primary">To Your Town.</span>
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-white/75 md:text-lg">
            We add new camp dates and host cities every season. If your
            region isn&rsquo;t on the schedule, message us — we can usually
            pull a regional camp together with enough interest.
          </p>
        </div>
        <Link href="/preview#contact">
          <Button
            size="lg"
            className="h-14 rounded-none bg-primary px-8 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(182,32,37,0.55)] hover:bg-primary/90"
          >
            Request A Camp
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
