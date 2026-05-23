import Link from "next/link";

import { ForgotForm } from "./forgot-form";

export const metadata = {
  title: "Reset password — QB Elite",
};

export default function ForgotPage() {
  return (
    <>
      <h1 className="text-center text-[20px] font-bold tracking-tight">
        Reset Your Password
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        We&apos;ll email you a link to set a new one.
      </p>
      <div className="mt-5">
        <ForgotForm />
      </div>
      <p className="mt-6 text-center text-sm text-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
}
