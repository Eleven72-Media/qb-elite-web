"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * Opens the Stripe Customer Portal (cancel / change plan / update card).
 * Hidden for users whose subscription_source isn't 'stripe' — Apple-
 * billed subscribers manage via iPhone Settings.
 */
export function ManageSubscriptionButton() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Couldn't open billing portal");
      }
      window.location.href = data.url;
    } catch (e) {
      setBusy(false);
      toast({
        title: "Couldn't open billing portal",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={onClick} disabled={busy}>
      {busy ? "Loading…" : "Manage subscription"}
    </Button>
  );
}
