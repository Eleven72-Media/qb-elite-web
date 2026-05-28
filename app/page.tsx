import { Apple, ArrowUpRight, Globe, Play } from "lucide-react";
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

      {/* Full-bleed dark hero backdrop */}
      <div className="absolute inset-x-0 top-0 h-[560px] md:h-[640px]">
        <Image
          src="/img_bg-login.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-white" />
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
      <section className="relative z-10 mx-auto flex w-full max-w-[820px] flex-col items-center px-5 pb-14 pt-10 text-center md:px-8 md:pb-20 md:pt-16">
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
          Get the app
        </h1>
        <p className="mt-4 max-w-[520px] text-base leading-relaxed text-white/85 md:text-lg">
          Pick your device — QB Elite runs natively on iPhone and Android, or
          install it straight from your browser.
        </p>
      </section>

      {/* Install cards */}
      <section className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-16 md:px-8 md:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <InstallCard
            icon={<Apple className="h-6 w-6" strokeWidth={1.75} />}
            title="iPhone & iPad"
            body="Download from the App Store, or open this page in Safari and tap Share → Add to Home Screen for a no-store install."
            ctaLabel="Open in App Store"
            ctaHref={APP_STORE_URL}
            external
          />
          <InstallCard
            icon={<Play className="h-6 w-6" strokeWidth={1.75} />}
            title="Android"
            body="Get the Play Store version, or open this site in Chrome and tap the install banner that pops up."
            ctaLabel="Open in Play Store"
            ctaHref={PLAY_STORE_URL}
            external
          />
          <InstallCard
            icon={<Globe className="h-6 w-6" strokeWidth={1.75} />}
            title="Web app"
            body="No store needed. Sign in once and QB Elite installs as a full-screen app you can launch from your dock or home screen."
            ctaLabel="Start in browser"
            ctaHref="/register"
            primary
          />
        </div>

        <p className="mx-auto mt-10 max-w-[520px] text-center text-sm text-muted-foreground">
          New here? Start with the 7-day free trial — no charge if you cancel
          before day 8.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
              className="h-12 w-[220px] rounded-full text-base"
            >
              I already have an account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-10 text-center text-xs text-muted-foreground md:px-8">
        <p>
          Learn more about QB Elite at{" "}
          <a
            href={MARKETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline"
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
        </p>
      </footer>
    </main>
  );
}

function InstallCard({
  icon,
  title,
  body,
  ctaLabel,
  ctaHref,
  external = false,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
  primary?: boolean;
}) {
  const ctaClasses = primary
    ? "inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-primary/90"
    : "inline-flex items-center justify-center rounded-full bg-foreground/[0.06] px-4 py-2 text-[13px] font-semibold text-foreground/85 hover:bg-foreground/[0.10]";

  const cta = external ? (
    <a
      href={ctaHref}
      target="_blank"
      rel="noopener noreferrer"
      className={ctaClasses}
    >
      {ctaLabel}
    </a>
  ) : (
    <Link href={ctaHref} className={ctaClasses}>
      {ctaLabel}
    </Link>
  );

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-extrabold tracking-tight">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-4">{cta}</div>
    </article>
  );
}
