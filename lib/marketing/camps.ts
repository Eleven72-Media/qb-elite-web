/**
 * Placeholder camp schedule for the marketing site. Swap for a real
 * Supabase query (or Justin's authoritative list) when available.
 *
 * Constraint per Justin: every weekend must show ≥2 camps (single-
 * camp days "look unprofessional"). Detail-page renderers should
 * still fall through cleanly if a day has only one camp during a
 * transitional period.
 */

export type Camp = {
  /** Lower-kebab slug used in the URL: /preview/camps/[slug] */
  id: string;
  title: string;
  location: string;
  region: string;
  /** ISO date for sorting + grouping (yyyy-mm-dd). */
  date: string;
  /** Pretty weekday for display. */
  weekday: string;
  /** Pretty month + day for display. */
  monthDay: string;
  time: string;
  ageGroup: string;
  price: string;
  shortDescription: string;
  /** Longer marketing copy for the detail page. Single paragraph. */
  longDescription: string;
  includes: string[];
  spotsLeft?: number;
};

export const CAMPS: Camp[] = [
  {
    id: "provo-jul11-ms",
    title: "Provo · Middle School",
    location: "Provo High School",
    region: "Provo, UT",
    date: "2026-07-11",
    weekday: "Saturday",
    monthDay: "July 11",
    time: "9:00 AM – 12:00 PM",
    ageGroup: "Grades 6–8",
    price: "$149",
    shortDescription:
      "Mechanics-first morning camp for middle school QBs. Footwork, drop steps, basic protections.",
    longDescription:
      "A morning-only camp built for middle school quarterbacks who are starting to take the position seriously. The QB Elite staff drills the same mechanics fundamentals that show up in our 1:1 sessions — base, footwork, and finish — then layers in basic protections and competition reps so the cues actually transfer to game speed.",
    includes: [
      "3 hours of on-field coaching",
      "Mechanics + footwork teaching block",
      "Competition reps",
      "Walk-out cues for Monday practice",
    ],
    spotsLeft: 8,
  },
  {
    id: "provo-jul11-hs",
    title: "Provo · High School",
    location: "Provo High School",
    region: "Provo, UT",
    date: "2026-07-11",
    weekday: "Saturday",
    monthDay: "July 11",
    time: "1:30 PM – 5:30 PM",
    ageGroup: "Grades 9–12",
    price: "$199",
    shortDescription:
      "Full mechanics + competition format for high school QBs. Coverage recognition added.",
    longDescription:
      "Afternoon camp for high school quarterbacks. Same mechanics curriculum as the morning session, plus a coverage-recognition block built around the looks you'll see on Friday nights. Closed with a competition period — read it, throw it, get coached on it in real time.",
    includes: [
      "4 hours of on-field coaching",
      "Mechanics teaching block",
      "Coverage recognition block",
      "Competition period with live grading",
      "Walk-out cues for Monday practice",
    ],
    spotsLeft: 4,
  },
  {
    id: "slc-jul18",
    title: "Salt Lake City",
    location: "TBD Field House",
    region: "Salt Lake City, UT",
    date: "2026-07-18",
    weekday: "Saturday",
    monthDay: "July 18",
    time: "9:00 AM – 1:00 PM",
    ageGroup: "Grades 6–12",
    price: "$179",
    shortDescription:
      "Cross-age camp split into MS and HS groups on the same field.",
    longDescription:
      "Our largest regional camp of the month — middle school and high school QBs train at the same venue, in separate position groups, on the same morning. Parents only have to make one trip and athletes get the same QB Elite staff coaching either way.",
    includes: [
      "4 hours of on-field coaching",
      "MS + HS groups on the same field",
      "Mechanics + competition",
      "Walk-out cues for Monday practice",
    ],
  },
  {
    id: "lasvegas-jul18",
    title: "Las Vegas",
    location: "TBD Sports Park",
    region: "Las Vegas, NV",
    date: "2026-07-18",
    weekday: "Saturday",
    monthDay: "July 18",
    time: "9:00 AM – 1:00 PM",
    ageGroup: "Grades 9–12",
    price: "$199",
    shortDescription:
      "High school camp for Nevada and Arizona athletes. Limited road-camp spots.",
    longDescription:
      "Our once-a-season road camp for Nevada and Arizona quarterbacks. Same coaches who run the Utah camps fly in for the day. Roster capped tighter than home camps so every QB gets eyes on every throw.",
    includes: [
      "4 hours of on-field coaching",
      "Capped roster — more reps per QB",
      "Coverage recognition block",
      "Competition period",
    ],
    spotsLeft: 6,
  },
  {
    id: "boise-jul25",
    title: "Boise",
    location: "TBD High School",
    region: "Boise, ID",
    date: "2026-07-25",
    weekday: "Saturday",
    monthDay: "July 25",
    time: "9:00 AM – 1:00 PM",
    ageGroup: "Grades 6–12",
    price: "$179",
    shortDescription:
      "Idaho regional camp. Mechanics, competition, film walk-through.",
    longDescription:
      "Boise regional camp built for Idaho quarterbacks. MS + HS QBs welcome, separated into position groups. Includes a film walk-through block where coaches show clips of correct and incorrect reps so athletes can see what they're being asked to do.",
    includes: [
      "4 hours of on-field coaching",
      "MS + HS groups",
      "Film walk-through block",
      "Competition period",
    ],
  },
  {
    id: "stgeorge-jul25",
    title: "St. George",
    location: "TBD High School",
    region: "St. George, UT",
    date: "2026-07-25",
    weekday: "Saturday",
    monthDay: "July 25",
    time: "9:00 AM – 1:00 PM",
    ageGroup: "Grades 6–12",
    price: "$179",
    shortDescription:
      "Southern Utah regional camp run by the QB Elite road staff.",
    longDescription:
      "Southern Utah regional camp. Same staff and same curriculum as our home camps — we don't subcontract local coaches. MS + HS QBs train in separate position groups on the same morning.",
    includes: [
      "4 hours of on-field coaching",
      "QB Elite staff (no subcontractors)",
      "MS + HS groups",
      "Competition period",
    ],
  },
  {
    id: "phoenix-aug8",
    title: "Phoenix",
    location: "TBD Sports Complex",
    region: "Phoenix, AZ",
    date: "2026-08-08",
    weekday: "Saturday",
    monthDay: "August 8",
    time: "8:00 AM – 12:00 PM",
    ageGroup: "Grades 9–12",
    price: "$199",
    shortDescription:
      "Arizona regional camp. Early start to beat the heat — bring water.",
    longDescription:
      "Our Phoenix road camp for Arizona quarterbacks. Early-morning start to beat the August heat — first whistle blows at 8 AM. Bring extra water; we'll have shade tents on every station.",
    includes: [
      "4 hours of on-field coaching",
      "Early start (heat-conscious schedule)",
      "Coverage recognition block",
      "Competition period",
    ],
    spotsLeft: 12,
  },
  {
    id: "denver-aug8",
    title: "Denver",
    location: "TBD Field House",
    region: "Denver, CO",
    date: "2026-08-08",
    weekday: "Saturday",
    monthDay: "August 8",
    time: "9:00 AM – 1:00 PM",
    ageGroup: "Grades 6–12",
    price: "$199",
    shortDescription:
      "Colorado regional. Full QB Elite mechanics curriculum + competition.",
    longDescription:
      "Denver regional camp for Colorado quarterbacks. Full QB Elite curriculum: mechanics + footwork in the morning, competition period in the afternoon, walk-out cues for Monday practice. MS + HS QBs welcome.",
    includes: [
      "4 hours of on-field coaching",
      "Full QB Elite curriculum",
      "MS + HS groups",
      "Competition period",
    ],
  },
];

/** Camps grouped by date, ordered chronologically. */
export type CampDay = {
  date: string;
  weekday: string;
  monthDay: string;
  camps: Camp[];
};

export function getCampSchedule(): CampDay[] {
  const byDate = new Map<string, CampDay>();
  for (const camp of CAMPS) {
    if (!byDate.has(camp.date)) {
      byDate.set(camp.date, {
        date: camp.date,
        weekday: camp.weekday,
        monthDay: camp.monthDay,
        camps: [],
      });
    }
    byDate.get(camp.date)!.camps.push(camp);
  }
  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getCampBySlug(slug: string): Camp | undefined {
  return CAMPS.find((c) => c.id === slug);
}

/** Other camps from the same date (for "Other camps this weekend" rail). */
export function getSiblingCamps(camp: Camp): Camp[] {
  return CAMPS.filter((c) => c.date === camp.date && c.id !== camp.id);
}
