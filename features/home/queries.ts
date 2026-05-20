import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Home screen data — admin-curated slider + widget cards.
 *
 * Both tables are public-read (RLS allows authenticated read; admin
 * panel is the only writer). Mapping snake_case → camelCase mirrors
 * the admin panel's supabase-queries.ts convention so any future
 * cross-pollination of components is plug-and-play.
 */

export interface HomeSlide {
  id: string;
  position: number;
  text: string | null;
  imageUrl: string | null;
  redirectUrl: string | null;
  isActive: boolean;
}

export interface HomeWidget {
  id: string;
  position: number;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  redirectUrl: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface HomeWidgetItem {
  id: string;
  widgetId: string;
  position: number;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  redirectUrl: string | null;
  imageUrl: string | null;
}

const mapSlide = (db: any): HomeSlide => ({
  id: db.id,
  position: db.position ?? 0,
  text: db.text ?? null,
  imageUrl: db.image_url ?? null,
  redirectUrl: db.redirect_url ?? null,
  isActive: db.is_active ?? true,
});

const mapWidget = (db: any): HomeWidget => ({
  id: db.id,
  position: db.position ?? 0,
  title: db.title ?? null,
  subtitle: db.subtitle ?? null,
  ctaText: db.cta_text ?? null,
  redirectUrl: db.redirect_url ?? null,
  imageUrl: db.image_url ?? null,
  isActive: db.is_active ?? true,
});

const mapWidgetItem = (db: any): HomeWidgetItem => ({
  id: db.id,
  widgetId: db.widget_id,
  position: db.position ?? 0,
  title: db.title ?? null,
  subtitle: db.subtitle ?? null,
  ctaText: db.cta_text ?? null,
  redirectUrl: db.redirect_url ?? null,
  imageUrl: db.image_url ?? null,
});

export async function getHomeSlides(
  supabase: SupabaseClient
): Promise<HomeSlide[]> {
  const { data, error } = await supabase
    .from("home_slider")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSlide).filter((s) => s.isActive);
}

export async function getHomeWidgets(
  supabase: SupabaseClient
): Promise<HomeWidget[]> {
  const { data, error } = await supabase
    .from("home_widget")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapWidget).filter((w) => w.isActive);
}

export async function getHomeWidgetItems(
  supabase: SupabaseClient,
  widgetId: string
): Promise<HomeWidgetItem[]> {
  const { data, error } = await supabase
    .from("home_widget_item")
    .select("*")
    .eq("widget_id", widgetId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapWidgetItem);
}
