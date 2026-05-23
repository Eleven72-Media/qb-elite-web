"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
    setFavorite(next);
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
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full transition-colors active:scale-95 disabled:opacity-50",
        favorite ? "bg-primary/15" : "bg-muted"
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          favorite ? "fill-primary text-primary" : "text-foreground/60"
        )}
        strokeWidth={favorite ? 0 : 1.75}
      />
    </button>
  );
}
