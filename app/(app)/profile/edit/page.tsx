import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { EditProfileForm } from "./edit-profile-form";

export const metadata = { title: "Edit Profile — QB Elite" };
export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, avatar_url, height, weight, recipe_preference, birth_date"
    )
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="container max-w-xl py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your name, photo, and stats.
        </p>
      </header>
      <EditProfileForm
        userId={user.id}
        initial={{
          displayName: profile?.display_name ?? "",
          avatarUrl: profile?.avatar_url ?? "",
          height: profile?.height ?? "",
          weight: profile?.weight ?? "",
          recipePreference: profile?.recipe_preference ?? "",
          birthDate: profile?.birth_date ?? null,
        }}
      />
    </div>
  );
}
