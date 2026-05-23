"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

/**
 * Registration with DOB.
 *
 * Mirrors the mobile signup flow (F-001): birth_date is required at
 * signup so plan-age gating works from day one. The mobile pattern is
 * signUp → handle_new_user trigger creates the profile row →
 * UPDATE profiles SET birth_date keyed on user.id. We replicate that
 * here. If email confirmation is required by the Supabase project, the
 * write may need to happen after the user verifies + signs in — handle
 * that case gracefully with a fallback in app/auth/callback.
 */
export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [busy, setBusy] = useState(false);

  function validate(): string | null {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords don't match.";
    if (!birthDate) return "Please enter your date of birth.";
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return "Invalid date of birth.";
    const now = new Date();
    const minDob = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    if (dob < minDob || dob > now) return "Date of birth looks off — please double-check.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ title: "Hold up", description: err, variant: "destructive" });
      return;
    }

    setBusy(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Stash birth_date in user_metadata as a fallback in case the
        // immediate profile update below races the auth.users insert
        // trigger. The callback route can read this on first sign-in
        // and write it to profiles if it's still NULL.
        data: { birth_date: birthDate },
        emailRedirectTo:
          (process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin) +
          "/auth/callback?next=/home",
      },
    });

    if (signUpError) {
      setBusy(false);
      toast({
        title: "Couldn't create account",
        description: signUpError.message,
        variant: "destructive",
      });
      return;
    }

    // Best-effort write to profile (will succeed if the project has email
    // confirmation off; otherwise we'll catch this in the auth callback).
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ birth_date: birthDate })
        .eq("id", data.user.id);
      if (profileError) {
        // Non-fatal — the callback route will retry after verify.
        console.warn("birth_date deferred write:", profileError.message);
      }
    }

    setBusy(false);

    if (data.session) {
      // No email verification required — sign-in is immediate.
      router.replace("/home");
      router.refresh();
    } else {
      // Email verification required.
      toast({
        title: "Check your email",
        description:
          "We sent a verification link. Tap it and you're in.",
      });
      // Park on /login so they have somewhere clean to land after verify.
      router.replace("/login?verify=1");
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="birth-date" className="text-sm font-semibold">
          Date of Birth
        </Label>
        <Input
          id="birth-date"
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          disabled={busy}
        />
        <p className="text-xs text-muted-foreground">
          We use this to match you with the right training plan.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-semibold">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm" className="text-sm font-semibold">
          Confirm Password
        </Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={busy}
        />
      </div>
      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-[250px] rounded-2xl text-base"
        >
          {busy ? "Creating account…" : "Sign Up"}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our{" "}
        <a
          href="https://qb-elite-launch.web.app/terms-of-service"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="https://qb-elite-launch.web.app/privacy-policy"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
