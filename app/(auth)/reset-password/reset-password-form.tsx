"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        title: "Hold up",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Hold up",
        description: "Passwords don't match.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({
        title: "Couldn't update password",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Password updated", description: "You're good to go." });
    router.replace("/home");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-semibold">
          New Password
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
      <div className="flex justify-center pt-1">
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-[250px] rounded-2xl text-base"
        >
          {busy ? "Saving…" : "Save New Password"}
        </Button>
      </div>
    </form>
  );
}
