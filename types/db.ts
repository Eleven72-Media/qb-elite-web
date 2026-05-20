/**
 * Supabase database types.
 *
 * Hand-maintained subset of the public schema — only the columns the PWA
 * actually reads/writes. Mirrors the shape used in the admin panel at
 * qb_elite_admin/shared/schema.ts so query helpers transplant cleanly.
 *
 * Full machine-generated types can be added later with
 * `supabase gen types typescript`. For Sprint 1 we just need the auth
 * + profile shape so the Supabase client is generic-safe.
 */

export type SubscriptionTier = "free" | "starter" | "legend" | "goat";
export type SubscriptionSource = "apple" | "google" | "stripe" | null;
export type UserRole = "user" | "admin" | null;

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  birth_date: string | null; // ISO date (yyyy-mm-dd)
  age: string | null;
  height: string | null;
  weight: string | null;
  avatar_url: string | null;
  recipe_preference: string | null;
  tier_upgraded_at: string | null;
  qb_training_started_at: string | null;
  subscription_source: SubscriptionSource;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  fcm_token: string | null;
  unit_system: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Minimal `Database` generic for @supabase/ssr clients. Only `profiles`
 * is typed for now; expand per feature as Sprint 2+ ports queries from
 * the admin panel's supabase-queries.ts.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      user_plan_week: {
        Args: { user_uuid?: string };
        Returns: number;
      };
      user_qb_training_week: {
        Args: { user_uuid?: string };
        Returns: number;
      };
      user_tier_int: {
        Args: { user_uuid?: string };
        Returns: number;
      };
      user_age_years: {
        Args: { user_uuid?: string };
        Returns: number | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
