import { getHomeSlides, getHomeWidgets } from "@/features/home/queries";
import { HomeSlider } from "@/features/home/components/home-slider";
import { WidgetRail } from "@/features/home/components/widget-rail";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Home — QB Elite" };

// Always re-fetch on each request — admin can edit slides/widgets and
// users should see fresh content. If this becomes a perf hot spot,
// switch to `revalidate = 60` for a 1-minute ISR window.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const [slides, widgets] = await Promise.all([
    getHomeSlides(supabase),
    getHomeWidgets(supabase),
  ]);

  return (
    <div className="container space-y-8 py-6">
      <HomeSlider slides={slides} />
      <WidgetRail widgets={widgets} />
      {slides.length === 0 && widgets.length === 0 && (
        <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          The admin hasn&apos;t set up home content yet — your dashboard will
          fill in as features unlock.
        </div>
      )}
    </div>
  );
}
