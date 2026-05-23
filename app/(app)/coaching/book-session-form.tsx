"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function BookSessionForm({
  userId,
  defaultName,
  defaultEmail,
}: {
  userId: string;
  defaultName: string;
  defaultEmail: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) {
      toast({
        title: "Hold up",
        description: "Pick a date and time first.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("coaching_sessions").insert({
      user_id: userId,
      client_name: name.trim() || null,
      client_email: email.trim() || null,
      client_phone: phone.trim() || null,
      session_date: date,
      start_time: time,
      status: "pending",
      notes: notes.trim() || null,
    });
    setBusy(false);
    if (error) {
      toast({
        title: "Couldn't book",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Session requested",
      description: "Coach will confirm or follow up by email.",
    });
    setNotes("");
    setDate("");
    setTime("");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="session-date" className="text-sm font-semibold">
            Date
          </Label>
          <Input
            id="session-date"
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            disabled={busy}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="session-time" className="text-sm font-semibold">
            Preferred time
          </Label>
          <Input
            id="session-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={busy}
            required
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="client-name" className="text-sm font-semibold">
            Athlete name
          </Label>
          <Input
            id="client-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-phone" className="text-sm font-semibold">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="client-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={busy}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="client-email" className="text-sm font-semibold">
          Email
        </Label>
        <Input
          id="client-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="session-notes" className="text-sm font-semibold">
          Anything we should know?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="session-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={busy}
          placeholder="What do you want to work on? Mechanics, decision-making, film review…"
        />
      </div>
      <Button
        type="submit"
        disabled={busy}
        className="h-12 w-full rounded-2xl text-base"
      >
        {busy ? "Submitting…" : "Request Session"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Coach will confirm by email or in-app within 24 hours.
      </p>
    </form>
  );
}
