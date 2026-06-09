import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Footer() {
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
            <span className="font-display text-xl uppercase tracking-[0.08em] text-white">
              QB Elite
            </span>
          </div>
          <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-white/65">
            Developing the complete quarterback — mechanics, film study,
            football IQ, and leadership.
          </p>
          <div className="mt-7 flex items-center gap-2">
            <SocialIcon icon={Instagram} href="https://www.instagram.com/qbelite/" label="Instagram" />
            <SocialIcon icon={Youtube} href="https://www.youtube.com/@qbelite" label="YouTube" />
            <SocialIcon icon={Facebook} href="https://www.facebook.com/qbelite" label="Facebook" />
          </div>
        </div>

        <FooterColumn
          title="Train"
          links={[
            { label: "QB Academy", href: "/preview/qb-academy" },
            { label: "Camps", href: "/preview/camps" },
            { label: "QB Elite App", href: "/preview/app" },
            { label: "Store", href: "/preview/store" },
          ]}
        />
        <FooterColumn
          title="About Us"
          links={[
            { label: "Coaches", href: "/preview/about" },
            { label: "Alumni", href: "/preview/about" },
            { label: "Sponsors", href: "/preview/about" },
            { label: "Contact", href: "/preview#contact" },
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
          <Link href="https://qb-elite-launch.web.app/terms-of-service" className="hover:text-white">
            Terms
          </Link>
          <Link href="https://qb-elite-launch.web.app/privacy-policy" className="hover:text-white">
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
