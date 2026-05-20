import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Sign up — QB Elite",
};

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-extrabold uppercase tracking-tight">
        Become Elite
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Start your 7-day free trial. No charge until day 8 — cancel any time.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
