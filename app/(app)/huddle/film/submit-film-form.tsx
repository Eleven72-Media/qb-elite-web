"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function SubmitFilmForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [videoLink, setVideoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoLink.trim()) {
      toast({
        title: "Hold up",
        description: "Drop a YouTube, Vimeo, or Hudl link.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("film_submissions").insert({
      user_id: userId,
      video_link: videoLink.trim(),
      notes: notes.trim(),
      status: "pending",
    });
    setBusy(false);
    if (error) {
      toast({
        title: "Couldn't submit",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Submitted",
      description: "Coach will review and post feedback here.",
    });
    setVideoLink("");
    setNotes("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="film-link">Video link</Label>
        <Input
          id="film-link"
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://youtu.be/... or https://hudl.com/..."
          disabled={busy}
          required
        />
        <p className="text-xs text-muted-foreground">
          Make sure the link is public or unlisted (not private) so the
          coach can open it.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="film-notes">What do you want feedback on?</Label>
        <Textarea
          id="film-notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. footwork on play action, mechanics under pressure, reading the safety…"
          disabled={busy}
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Submitting…" : "Send for review"}
      </Button>
    </form>
  );
}
