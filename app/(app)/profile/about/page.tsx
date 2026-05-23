import { Apple, Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";

export const metadata = { title: "About — QB Elite" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Us" backHref="/profile" />
      <div className="mx-auto w-full max-w-[640px] space-y-5 px-5 pb-8 md:px-6">
        <section className="flex flex-col items-center pt-3 text-center">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
            <Image
              src="/logo.png"
              alt="QB Elite"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="mt-4 text-[22px] font-extrabold tracking-tight">
            QB Elite
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            #becomeelite
          </p>
        </section>

        <p className="text-sm leading-relaxed text-foreground/85">
          Our quarterback training membership empowers young athletes to excel
          both on and off the field through comprehensive mental, physical,
          mechanical, and leadership skill development.
        </p>

        <div className="space-y-3">
          <LinkRow
            href="mailto:jmiller@qbelite.com?subject=QB%20Elite%20-%20Support%20Request"
            icon={<Mail className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Contact support"
            sub="jmiller@qbelite.com"
          />
          <LinkRow
            href="https://qb-elite-launch.web.app/terms-of-service"
            icon={<Globe className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Terms of Service"
            external
          />
          <LinkRow
            href="https://qb-elite-launch.web.app/privacy-policy"
            icon={<Globe className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="Privacy Policy"
            external
          />
          <LinkRow
            href="https://apps.apple.com/us/app/qb-elite/id6753002596"
            icon={<Apple className="h-5 w-5 text-primary" strokeWidth={1.75} />}
            label="QB Elite on the App Store"
            external
          />
        </div>

        <p className="pt-3 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Eleven72 Media. All rights reserved.
        </p>
      </div>
    </>
  );
}

function LinkRow({
  href,
  icon,
  label,
  sub,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_10px_rgba(167,174,193,0.21)] active:opacity-90">
      <span>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-foreground">{label}</p>
        {sub && <p className="text-[12px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
