import Link from "next/link";

import { ForgotForm } from "./forgot-form";

export const metadata = {
  title: "Reset password — QB Elite",
};

export default function ForgotPage() {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-extrabold uppercase tracking-tight">
        Reset your password
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        We&apos;ll email you a link to set a new one.
      </p>
      <ForgotForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
