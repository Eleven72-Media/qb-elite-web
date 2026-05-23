"use client";

import { Camera } from "lucide-react";
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
      <section className="flex flex-col items-center pt-2">
        <div className="relative">
          <Avatar className="h-[100px] w-[100px] ring-4 ring-white shadow-[0_4px_18px_rgba(0,0,0,0.08)]">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/15 text-2xl text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Label
            htmlFor="avatar"
            className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md ring-2 ring-white"
          >
            <Camera className="h-4 w-4" strokeWidth={2} />
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
        <p className="mt-3 text-xs text-muted-foreground">
          {avatarUrl ? "Tap the camera to replace" : "Tap to upload a photo"}
        </p>
      </section>

      <div className="space-y-1.5">
        <Label htmlFor="display-name" className="text-sm font-semibold">
          Display Name
        </Label>
        <Input
          id="display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Marcus T."
          disabled={busy}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="height" className="text-sm font-semibold">
            Height
          </Label>
          <Input
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={`e.g. 6'1"`}
            disabled={busy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight" className="text-sm font-semibold">
            Weight
          </Label>
          <Input
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 185"
            disabled={busy}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="recipe-pref" className="text-sm font-semibold">
          Recipe Preference
        </Label>
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
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Date of Birth</Label>
          <p className="rounded-xl bg-muted px-3.5 py-3 text-sm">
            {formattedDob}
          </p>
          <p className="text-xs text-muted-foreground">
            Date of birth is set once at signup. Contact support to change it.
          </p>
        </div>
      )}

      <div className="pt-3">
        <Button
          type="submit"
          disabled={busy}
          className="h-14 w-full gap-2 rounded-2xl text-base"
        >
          {busy ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
