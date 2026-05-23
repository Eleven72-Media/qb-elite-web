import { Brain, Dumbbell, Sparkles, Users, Utensils, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "QB Elite — Become Elite",
  description:
    "Full quarterback training. Workouts, mechanics, mindset, meal plans, live Huddles. 7-day free trial.",
};

export default function MarketingHome() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/img_bg-login.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/75" />
        </div>
        <nav className="relative z-10 mx-auto flex w-full max-w-[1100px] items-center justify-between px-5 pb-3 pt-[max(env(safe-area-inset-top),1rem)] md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5 shadow-md">
              <Image
                src="/logo.png"
                alt="QB Elite"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-base font-extrabold uppercase tracking-tight text-white">
              QB Elite
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 hover:text-white"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="h-9 rounded-full bg-white px-4 text-primary hover:bg-white/90"
              >
                Start Free
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center px-5 pb-24 pt-16 text-center md:px-8 md:pb-32 md:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            #becomeelite
          </span>
          <h1 className="mt-5 max-w-3xl text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight text-white md:text-6xl">
            Train like the best.
            <br />
            Play like the best.
          </h1>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-white/85 md:text-lg">
            Full quarterback training on iPhone, Android, and desktop — workouts,
            mechanics, mindset, meal plans, and live Huddles with college and pro QBs.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 w-[220px] rounded-full text-base shadow-lg"
              >
                Start 7-Day Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-[220px] rounded-full border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20"
              >
                I already have an account
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/65">
            No charge for 7 days. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            What you get
          </p>
          <h2 className="mt-2 text-[28px] font-extrabold tracking-tight md:text-[36px]">
            Everything a QB needs in one place
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-6 w-6" strokeWidth={1.75} />}
            title="The Classroom"
            body="Weekly QB IQ trainings — film breakdowns, mechanics, and mindset, drip-released to keep you sharp."
          />
          <FeatureCard
            icon={<Dumbbell className="h-6 w-6" strokeWidth={1.75} />}
            title="Weight Room"
            body="Sport-specific workout plans built for QBs. Lifts, mobility, and arm care on a weekly schedule."
          />
          <FeatureCard
            icon={<Utensils className="h-6 w-6" strokeWidth={1.75} />}
            title="Nutrition"
            body="Weekly meal plans and recipes built around your training. Breakfast through dinner, no guesswork."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" strokeWidth={1.75} />}
            title="The Huddle"
            body="Live group sessions with coaches and pro QBs. Recorded Q&As and film studies in your pocket."
          />
          <FeatureCard
            icon={<Video className="h-6 w-6" strokeWidth={1.75} />}
            title="Film Breakdown"
            body="Send your own game film. A coach reviews it and posts written feedback. Legend + GOAT tiers."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" strokeWidth={1.75} />}
            title="1-on-1 Coaching"
            body="GOAT tier unlocks scheduled 1-on-1 virtual sessions with Coach Miller. Custom-priced per athlete."
          />
        </div>
      </section>

      {/* TRIAL CTA */}
      <section className="bg-gradient-to-br from-primary to-primary/85 py-16 md:py-20">
        <div className="mx-auto max-w-[760px] px-5 text-center md:px-8">
          <h2 className="text-[28px] font-extrabold uppercase tracking-tight text-white md:text-[36px]">
            Start free.
            <br className="md:hidden" /> Cancel anytime.
          </h2>
          <p className="mx-auto mt-3 max-w-prose text-base text-white/85">
            7 days free, then choose Starter or Legend. No charge if you cancel
            before day 8.
          </p>
          <div className="mt-7 flex justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 w-[260px] rounded-full bg-white text-base text-primary shadow-lg hover:bg-white/90"
              >
                Start 7-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto w-full max-w-[1100px] px-5 py-10 text-center text-xs text-muted-foreground md:px-8">
        <p>© {new Date().getFullYear()} Eleven72 Media. All rights reserved.</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a
            href="https://qb-elite-launch.web.app/terms-of-service"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            Terms
          </a>
          <a
            href="https://qb-elite-launch.web.app/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            Privacy
          </a>
          <a href="mailto:jmiller@qbelite.com" className="hover:text-primary">
            Support
          </a>
          <a
            href="https://apps.apple.com/us/app/qb-elite/id6753002596"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            App Store
          </a>
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-extrabold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
