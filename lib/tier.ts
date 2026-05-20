import type { SubscriptionTier } from "@/types/db";

/**
 * Tier comparator + helpers.
 *
 * Source of truth is the server (RLS enforces real access). Client uses
 * these for UI flourishes only — hiding a "Legend" badge from free
 * users, showing "Locked" overlays, etc.
 */

const ORDER: SubscriptionTier[] = ["free", "starter", "legend", "goat"];

export function tierIndex(tier: SubscriptionTier | null | undefined): number {
  const t = (tier ?? "free").toLowerCase() as SubscriptionTier;
  const i = ORDER.indexOf(t);
  return i < 0 ? 0 : i;
}

export function tierSatisfies(
  current: SubscriptionTier | null | undefined,
  minimum: SubscriptionTier
): boolean {
  return tierIndex(current) >= tierIndex(minimum);
}

export function tierDisplayName(tier: SubscriptionTier | null | undefined): string {
  switch ((tier ?? "free").toLowerCase()) {
    case "starter":
      return "Starter";
    case "legend":
      return "Legend";
    case "goat":
      return "GOAT";
    default:
      return "Free";
  }
}
