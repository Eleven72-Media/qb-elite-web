"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function EditProfileForm({
  userId,
  initial,
}: {
  userId: string;
  initial: {
    displayName: string;
    avatarUrl: string;
    height: string;
    weight: string;
    recipePreference: string;
    birthDate: string | null;
  };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(initial.displayName);
  const [height, setHeight] = useState(initial.height);
  const [weight, setWeight] = useState(initial.weight);
  const [recipePref, setRecipePref] = useState(initial.recipePreference);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [busy, setBusy] = useState(false);

  async function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (uploadError) {
      setBusy(false);
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
    setBusy(false);
    toast({ title: "Photo uploaded", description: "Don't forget to save." });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        height: height.trim() || null,
        weight: weight.trim() || null,
        recipe_preference: recipePref.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", userId);
    setBusy(false);
    if (error) {
      toast({
        title: "Couldn't save",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Saved", description: "Profile updated." });
    router.replace("/profile");
    router.refresh();
  }

  const initials = (displayName || "QB").slice(0, 2).toUpperCase();
  const formattedDob = initial.birthDate
    ? new Date(initial.birthDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <section className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Label htmlFor="avatar" className="cursor-pointer">
            <span className="inline-flex items-center rounded-md border bg-card px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
              {avatarUrl ? "Replace photo" : "Upload photo"}
            </span>
          </Label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onAvatarPick}
            disabled={busy}
          />
        </div>
      </section>

      <div className="space-y-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Marcus T."
          disabled={busy}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 6'1&quot;"
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 185"
            disabled={busy}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipe-pref">Recipe preference</Label>
        <Input
          id="recipe-pref"
          value={recipePref}
          onChange={(e) => setRecipePref(e.target.value)}
          placeholder="e.g. no dairy"
          disabled={busy}
        />
        <p className="text-xs text-muted-foreground">
          Tells the meal plan which recipes to surface first.
        </p>
      </div>

      {formattedDob && (
        <div className="space-y-2">
          <Label>Date of birth</Label>
          <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
            {formattedDob}
          </p>
          <p className="text-xs text-muted-foreground">
            Date of birth is set once at signup. Contact support to change it.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
