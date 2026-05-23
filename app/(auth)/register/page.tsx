import Link from "next/link";

import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Sign up — QB Elite",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-center text-[20px] font-bold tracking-tight">
        Become Elite
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Start your 7-day free trial. Cancel any time.
      </p>
      <div className="mt-5">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
}
