"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Heart toggle that writes to `favorite_videos` (the catch-all
 * favorite table for both QB trainings + weight room videos +
 * nutrition videos, keyed by `video_type`).
 *
 * Mirrors the mobile favorite_videos pattern. RLS gates writes to the
 * caller's own user_id.
 */
export function FavoriteButton({
  videoId,
  videoType,
  initialFavorite,
  variant = "icon",
}: {
  videoId: string;
  videoType: "qb_training" | "weight_room" | "nutrition";
  initialFavorite: boolean;
  variant?: "icon" | "labeled";
}) {
  const supabase = createClient();
  const { toast } = useToast();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !favorite;
    setFavorite(next); // optimistic flip
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavorite(!next);
        toast({ title: "Please log in to save favorites.", variant: "destructive" });
        return;
      }
      if (next) {
        const { error } = await supabase.from("favorite_videos").insert({
          user_id: user.id,
          video_id: videoId,
          video_type: videoType,
        });
        if (error && error.code !== "23505") {
          // 23505 = unique-violation (already favorited). Treat as success.
          setFavorite(!next);
          toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
        }
      } else {
        const { error } = await supabase
          .from("favorite_videos")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId)
          .eq("video_type", videoType);
        if (error) {
          setFavorite(!next);
          toast({ title: "Couldn't remove", description: error.message, variant: "destructive" });
        }
      }
    });
  }

  if (variant === "labeled") {
    return (
      <Button variant="outline" onClick={toggle} disabled={pending} size="sm">
        <Heart
          className={cn("mr-2 h-4 w-4", favorite ? "fill-primary text-primary" : "")}
        />
        {favorite ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
      className="rounded-full border bg-card p-2 transition-colors hover:bg-accent disabled:opacity-50"
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          favorite ? "fill-primary text-primary" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
