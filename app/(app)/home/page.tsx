import { IosA2HSPrompt } from "@/components/ios-a2hs-prompt";
import { HomeSlider } from "@/features/home/components/home-slider";
import { QuickActions } from "@/features/home/components/quick-actions";
import { WidgetRail } from "@/features/home/components/widget-rail";
import { getHomeSlides, getHomeWidgets } from "@/features/home/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import type { SubscriptionTier } from "@/types/db";

export const metadata = { title: "Home — QB Elite" };
export const dynamic = "force-dynamic";

// Routes the Flutter app considers "starter-gated" home-widget redirects.
// Used to overlay a lock icon on widgets that point to gated content if
// the user can't access them yet.
const STARTER_GATED_REDIRECTS = [
  "/recipeDetailsScreen",
  "/plannedMealScreen",
  "/workoutPlanScreen",
  "/plannedWorkoutScreen",
];

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRow } = user
    ? await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  const tier = (profileRow as { subscription_tier: SubscriptionTier } | null)
    ?.subscription_tier;

  const goatLocked = !tierSatisfies(tier, "goat");
  const starterLocked = !tierSatisfies(tier, "starter");

  const [slides, widgets] = await Promise.all([
    getHomeSlides(supabase),
    getHomeWidgets(supabase),
  ]);

  const lockedWidgetRedirects = starterLocked ? STARTER_GATED_REDIRECTS : [];

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-7 pb-2 pt-3 md:px-6">
      <IosA2HSPrompt />
      <HomeSlider slides={slides} />

      <section className="space-y-3 px-5 md:px-0">
        <h2 className="text-[18px] font-bold text-foreground">
          Quick Actions
        </h2>
        <QuickActions goatLocked={goatLocked} />
      </section>

      <section className="space-y-4 px-5 md:px-0">
        <h2 className="text-[18px] font-bold text-foreground">Daily Grind</h2>
        <WidgetRail
          widgets={widgets}
          lockedRedirectUrls={lockedWidgetRedirects}
        />
      </section>

      {slides.length === 0 && widgets.length === 0 && (
        <div className="mx-5 rounded-[20px] border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground md:mx-0">
          The admin hasn&apos;t set up home content yet — your dashboard will
          fill in as features unlock.
        </div>
      )}
    </div>
  );
}
