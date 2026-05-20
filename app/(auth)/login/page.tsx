import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Log in — QB Elite",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-extrabold uppercase tracking-tight">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Log in to continue your training.
      </p>
      <LoginForm next={searchParams.next ?? "/home"} error={searchParams.error} />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
