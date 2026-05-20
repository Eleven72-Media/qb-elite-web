import Link from "next/link";

/**
 * Auth shell — light card centered on a brand-tinted background.
 * Used for /login, /register, /forgot, /reset-password.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="container flex items-center justify-between py-6">
        <Link
          href="/"
          className="text-lg font-extrabold uppercase tracking-tight"
        >
          QB Elite
        </Link>
        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          #becomeelite
        </span>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
