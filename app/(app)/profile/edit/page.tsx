import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
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
    <>
      <PageHeader title="Edit Profile" backHref="/profile" />
      <div className="mx-auto w-full max-w-[640px] px-5 pb-6 md:px-6">
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
    </>
  );
}
