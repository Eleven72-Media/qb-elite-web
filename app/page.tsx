import { Apple, ArrowUpRight, Globe, Play, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IosA2HSPrompt } from "@/components/ios-a2hs-prompt";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Get QB Elite — iPhone, Android, Web",
  description:
    "Download QB Elite on iPhone, Android, or install the web app. Workouts, mechanics, mindset, meal plans, and live Huddles with Coach Miller.",
};

const APP_STORE_URL = "https://apps.apple.com/us/app/qb-elite/id6753002596";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.quarterbackelite.app";
const MARKETING_URL = "https://qbelite.com/app/";

/**
 * qbeliteapp.com landing — *download-only* page. The full marketing
 * story (features, tiers, social proof, founder bio) lives at
 * qbelite.com/app. This route exists purely so iPhone / Android / Web
 * users can land on the install option that fits their device and
 * either get the app or sign into the PWA.
 */
export default function DownloadHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <IosA2HSPrompt />

      {/* Full-bleed brand-navy hero backdrop. Matches qbelite.com/app
          — deep navy ladder up top, blends into white below the hero. */}
      <div className="absolute inset-x-0 top-0 h-[640px] md:h-[720px]">
        <div className="absolute inset-0 bg-brand-navyDeep" />
        <Image
          src="/img_bg-login.png"
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-luminosity"
          sizes="100vw"
        />
        {/* Navy-tinted vignette + soft red accent glow in the corner */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navyDeep/85 via-brand-navy/75 to-white" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/22 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0693e3]/15 blur-3xl"
        />
      </div>

      {/* Header */}
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
        <Link
          href="/login"
          className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 hover:text-white"
        >
          Log in
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-[820px] flex-col items-center px-5 pb-12 pt-10 text-center md:px-8 md:pb-16 md:pt-16">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-3xl bg-white/15 p-3 shadow-2xl ring-1 ring-white/25 backdrop-blur">
          <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h1 className="mt-6 text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight text-white md:text-5xl">
          Install QB Elite
        </h1>
        <p className="mt-4 max-w-[540px] text-base leading-relaxed text-white/85 md:text-lg">
          Use it in seconds — no app store required. Works on iPhone, Android,
          and desktop browsers.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="h-12 w-[240px] rounded-full bg-white text-base text-primary shadow-lg hover:bg-white/90"
            >
              Start Free in Browser
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-[240px] rounded-full border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20"
            >
              I already have an account
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/65">
          7 days free, cancel anytime. No download required.
        </p>
      </section>

      {/* Primary install — web/PWA. Navy card with a red accent rail
          on the left to mirror the qbelite.com brand pairing. */}
      <section className="relative z-10 mx-auto w-full max-w-[820px] px-5 pb-10 md:px-8">
        <article className="relative overflow-hidden rounded-[28px] bg-brand-navyDeep p-7 text-white shadow-[0_24px_60px_rgba(0,41,71,0.45)] ring-1 ring-white/10 md:p-9">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-primary"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-2xl"
          />
          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
              <Globe className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  <Sparkles className="h-3 w-3" strokeWidth={2.25} />
                  Recommended
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/65">
                  <Zap className="h-3 w-3" strokeWidth={2.25} />
                  Installs in seconds
                </span>
              </div>
              <h2 className="mt-2 text-[22px] font-extrabold tracking-tight md:text-[26px]">
                Use the web app
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75 md:text-base">
                The fastest way in. Sign in once, then QB Elite installs to
                your home screen as a full-screen app — no store account, no
                download wait, no updates to manage. Works on iPhone, Android,
                Mac, and Windows.
              </p>
            </div>
          </div>
          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="sm:flex-1">
              <Button
                size="lg"
                className="h-12 w-full rounded-full text-base shadow-md"
              >
                Start Free 7-Day Trial
              </Button>
            </Link>
            <Link href="/login" className="sm:w-[200px]">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                Log in
              </Button>
            </Link>
          </div>
        </article>
      </section>

      {/* Secondary install — native app stores */}
      <section className="relative z-10 mx-auto w-full max-w-[820px] px-5 pb-16 md:px-8 md:pb-24">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-brand-navy/70">
          Prefer a native app?
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-brand-navy/15 bg-white px-5 py-4 transition-colors hover:border-brand-navy/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-navy/14">
              <Apple className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-navy/60">
                iPhone & iPad
              </span>
              <span className="block text-[14px] font-bold tracking-tight text-brand-navy">
                Download on the App Store
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-brand-navy/40 group-hover:text-brand-navy/80"
              strokeWidth={2}
            />
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-brand-navy/15 bg-white px-5 py-4 transition-colors hover:border-brand-navy/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-navy/14">
              <Play className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-navy/60">
                Android
              </span>
              <span className="block text-[14px] font-bold tracking-tight text-brand-navy">
                Get it on Google Play
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-brand-navy/40 group-hover:text-brand-navy/80"
              strokeWidth={2}
            />
          </a>
        </div>
      </section>

      {/* Footer — navy band bookends the hero, matching qbelite.com */}
      <footer className="relative z-10 bg-brand-navyDeep py-10 text-center text-xs text-white/70">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8">
          <p>
            Learn more about QB Elite at{" "}
            <a
              href={MARKETING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-white hover:underline"
            >
              qbelite.com
              <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
            </a>
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} Eleven72 Media. All rights reserved.
          </p>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://qb-elite-launch.web.app/terms-of-service"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Terms
            </a>
            <a
              href="https://qb-elite-launch.web.app/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Privacy
            </a>
            <a href="mailto:jmiller@qbelite.com" className="hover:text-white">
              Support
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

