import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * OAuth + email-verification callback.
 *
 * Supabase redirects here after:
 *   - Google OAuth completes (`signInWithOAuth`)
 *   - User clicks the email verification link (`signUp` with email confirm on)
 *   - User clicks the password-reset link (`resetPasswordForEmail`)
 *
 * For OAuth + email verify we exchange the `code` for a session, then
 * redirect to `next` (default `/home`). For password reset the redirect
 * target is `/reset-password` and the session is established the same way.
 *
 * Also handles a backfill case: if the user registered with a birth_date
 * in user_metadata but the immediate client-side profile update failed
 * (because email confirmation was on and there was no session yet), we
 * write it now on the first verified entry.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Birth-date backfill: write to profiles if metadata has it and
      // the row's birth_date is still NULL.
      const dobFromMeta = data.user.user_metadata?.birth_date as
        | string
        | undefined;
      if (dobFromMeta) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("birth_date")
          .eq("id", data.user.id)
          .maybeSingle();
        if (existing && existing.birth_date === null) {
          await supabase
            .from("profiles")
            .update({ birth_date: dobFromMeta })
            .eq("id", data.user.id);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Code exchange failed — kick back to login with the error message.
    const msg = error?.message ?? "Authentication failed. Please try again.";
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(msg)}`
    );
  }

  // No code in URL — odd. Send them to login.
  return NextResponse.redirect(`${origin}/login`);
}
