/**
 * Resolves admin-authored redirect URLs into client-side navigation.
 *
 * Mirrors qb_elite_source/lib/src/core/routes/redirect_navigator.dart.
 * The admin home-settings dropdown stores either:
 *   - A Flutter route path (e.g. `/classroom`, `/weight-room`)
 *   - A per-item deep link (e.g. `/classroom/video?id=<uuid>`)
 *   - A per-week deep link (e.g. `/classroom?week=Week+0`)
 *   - An https URL (opens in a new tab on web — the Flutter equivalent
 *     opened in the in-app browser)
 *   - The literal sentinel `__external__` (admin picked External URL but
 *     hasn't typed it yet) — silently ignore.
 *
 * Flutter route names map 1:1 to PWA routes (we used the same paths in
 * app/(app)/*). The one exception is `/videoDetailScreen` in the admin
 * spec — that's the Weight Room video player, routed to `/weight-room/video`
 * on the PWA (TODO when that route is built).
 */

const ROUTE_REWRITES: Record<string, string> = {
  // Flutter route → PWA route. Most are 1:1; this map handles the few that diverge.
  "/videoDetailScreen": "/weight-room/video",
  "/recipeDetailsScreen": "/nutrition/recipe",
  "/menuScreen": "/profile",
  "/onboardingScreen": "/",
  "/loginScreen": "/login",
  "/registerScreen": "/register",
  "/forgetPassScreen": "/forgot",
  "/editProfileScreen": "/profile/edit",
  "/favoriteScreen": "/profile/favorites",
  "/notificationScreen": "/profile/notifications",
  "/plannedMealScreen": "/nutrition/planner",
  "/plannedWorkoutScreen": "/weight-room/planned",
  "/workoutDetailScreen": "/weight-room/workout",
  "/workoutPlanScreen": "/weight-room/plan",
  "/weightRoomCollectionScreen": "/weight-room",
  "/collectionTrainingsScreen": "/weight-room/collection",
  "/athleteResourcesScreen": "/resources",
  "/scheduleCoachingScreen": "/coaching",
  "/filmBreakdownScreen": "/huddle/film",
};

export interface ResolvedRedirect {
  kind: "internal" | "external" | "none";
  href: string;
  /** External-URL targets open in a new tab via `target="_blank"`. */
  external?: boolean;
}

export function resolveRedirect(raw: string | null | undefined): ResolvedRedirect {
  const url = (raw ?? "").trim();
  if (!url || url === "__external__") {
    return { kind: "none", href: "#" };
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return { kind: "external", href: url, external: true };
  }
  // Split path from query so we can rewrite the path bit without losing params.
  const [path, query] = url.split("?");
  const rewritten = ROUTE_REWRITES[path] ?? path;
  const href = query ? `${rewritten}?${query}` : rewritten;
  return { kind: "internal", href };
}
