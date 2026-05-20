import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * Used in client components ('use client' files). Stores the session in
 * cookies (via @supabase/ssr) so the server middleware can also read it.
 * Safe to instantiate anywhere — the SDK is small and the client itself
 * is lightweight.
 *
 * Untyped for Sprint 1 — Sprint 2 swaps in machine-generated types via
 * `supabase gen types typescript`.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
