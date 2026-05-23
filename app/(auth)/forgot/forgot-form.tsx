"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function ForgotForm() {
  const supabase = createClient();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast({
        title: "Couldn't send reset link",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
        Reset link sent to <strong>{email}</strong>. Check your inbox (and spam
        folder).
      </div>
    );
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
      <div className="flex justify-center pt-1">
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-[250px] rounded-2xl text-base"
        >
          {busy ? "Sending…" : "Send Reset Link"}
        </Button>
      </div>
    </form>
  );
}
