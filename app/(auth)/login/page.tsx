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
    <>
      <h1 className="text-center text-[20px] font-bold tracking-tight">
        Welcome Back!
      </h1>
      <div className="mt-5">
        <LoginForm next={searchParams.next ?? "/home"} error={searchParams.error} />
      </div>
      <p className="mt-6 text-center text-sm text-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
}
