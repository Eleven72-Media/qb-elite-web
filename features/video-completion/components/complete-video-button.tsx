"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

/**
 * Writes a row to `video_completions` keyed on (user_id, video_id, video_type).
 * Mirrors the mobile completion-tracking flow.
 *
 * Idempotent: re-clicking is a no-op (RLS + unique constraint handle dedup).
 * Sprint 4 may wire this to fire automatically off Vimeo Player.js `ended`
 * events instead of a manual button.
 */
export function CompleteVideoButton({
  videoId,
  videoType,
  initialCompleted,
}: {
  videoId: string;
  videoType: "qb_training" | "weight_room" | "nutrition";
  initialCompleted: boolean;
}) {
  const supabase = createClient();
  const { toast } = useToast();
  const [completed, setCompleted] = useState(initialCompleted);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (completed) return;
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in.", variant: "destructive" });
        return;
      }
      const { error } = await supabase.from("video_completions").insert({
        user_id: user.id,
        video_id: videoId,
        video_type: videoType,
      });
      if (error && error.code !== "23505") {
        toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
        return;
      }
      setCompleted(true);
      toast({ title: "Marked complete", description: "Nice work." });
    });
  }

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? "outline" : "default"}
        size="lg"
        onClick={onClick}
        disabled={completed || pending}
      >
        {completed ? (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" /> Completed
          </>
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" /> Mark Complete
          </>
        )}
      </Button>
    </div>
  );
}
