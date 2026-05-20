import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware.
 *
 * Runs on every protected route. Refreshes the Supabase session token
 * cookie if it's about to expire (so the user doesn't get bounced to
 * login mid-session) AND redirects unauthenticated users away from the
 * `(app)` route group.
 *
 * The match list at the bottom (config.matcher) keeps this off static
 * assets / Next internals.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // This call refreshes the session if expired and rewrites the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAppRoute =
    path.startsWith("/home") ||
    path.startsWith("/weight-room") ||
    path.startsWith("/classroom") ||
    path.startsWith("/nutrition") ||
    path.startsWith("/huddle") ||
    path.startsWith("/resources") ||
    path.startsWith("/coaching") ||
    path.startsWith("/profile") ||
    path.startsWith("/paywall");

  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  // Unauthenticated user trying to reach an app route → kick to /login.
  if (isAppRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Already logged in but on /login or /register → push to /home.
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except:
     * - _next/static, _next/image, favicon, manifest, icons (static assets)
     * - .well-known (Apple App Site Association etc. for later)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/|splash/|.well-known/).*)",
  ],
};
