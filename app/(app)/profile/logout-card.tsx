"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutCard() {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onLogout() {
    if (!confirm("Do you want to logout from the app?")) return;
    setBusy(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={onLogout}
        disabled={busy}
        size="lg"
        className="h-14 w-full gap-2 rounded-2xl text-base"
      >
        <LogOut className="h-5 w-5" strokeWidth={2} />
        {busy ? "Logging out…" : "Logout"}
      </Button>
      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              "Do you want to delete your account? This cannot be undone."
            )
          ) {
            alert(
              "Account deletion isn't wired up on the web yet. Email jmiller@qbelite.com and we'll remove your account."
            );
          }
        }}
        className="block w-full py-3 text-center text-base font-bold text-destructive"
      >
        Delete Account
      </button>
    </div>
  );
}
