"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

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
    <Button
      variant={completed ? "outline" : "default"}
      onClick={onClick}
      disabled={completed || pending}
      className="h-14 w-full gap-2 rounded-2xl text-base"
    >
      {completed ? (
        <>
          <CheckCircle2 className="h-5 w-5" strokeWidth={2} /> Completed
        </>
      ) : (
        <>
          <Check className="h-5 w-5" strokeWidth={2.25} /> Mark Complete
        </>
      )}
    </Button>
  );
}
