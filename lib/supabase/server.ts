import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * Used in React Server Components, Route Handlers, and Server Actions.
 * Reads + refreshes the session from the cookie jar via Next's
 * `cookies()` helper. The `set` / `remove` handlers are wrapped in
 * try/catch because Server Components are not allowed to write cookies
 * (Next throws otherwise) — only middleware can. That's fine: the
 * middleware handles all session refresh writes.
 *
 * Untyped for Sprint 1 — Sprint 2 swaps in machine-generated types via
 * `supabase gen types typescript`.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components can't set cookies. Safe to ignore —
            // middleware will write on the next request.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same reason — middleware handles cookie removal.
          }
        },
      },
    }
  );
}
