"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next, error }: { next: string; error?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setBusy(false);
      toast({
        title: "Couldn't sign in",
        description: signInError.message,
        variant: "destructive",
      });
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function onGoogle() {
    setBusy(true);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setBusy(false);
      toast({
        title: "Couldn't sign in with Google",
        description: oauthError.message,
        variant: "destructive",
      });
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {decodeURIComponent(error)}
        </div>
      )}
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
        <Label htmlFor="password" className="text-sm font-semibold">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />
        <div className="flex justify-end pt-1">
          <Link
            href="/forgot"
            className="text-sm font-medium text-foreground/70 hover:text-primary"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <div className="flex justify-center pt-1">
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-[250px] rounded-2xl text-base"
        >
          {busy ? "Logging in…" : "Log in"}
        </Button>
      </div>
      <div className="relative py-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="relative z-10 bg-white px-3">or</span>
        <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-2xl text-base"
        onClick={onGoogle}
        disabled={busy}
      >
        Continue with Google
      </Button>
    </form>
  );
}
