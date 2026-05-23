import { ArrowRight, BadgeCheck, ExternalLink, Lock, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NutritionTabs } from "@/features/nutrition/components/nutrition-tabs";
import { RecipesWithCategories } from "@/features/nutrition/components/recipes-with-categories";
import {
  getNutritionVideos,
  getRecipeCategories,
  getRecipes,
  getUserMealPlan,
  type NutritionVideo,
} from "@/features/nutrition/queries";
import { createClient } from "@/lib/supabase/server";
import { tierSatisfies } from "@/lib/tier";
import { vimeoThumbnailUrl } from "@/lib/vimeo";
import type { SubscriptionTier } from "@/types/db";

export const metadata = { title: "Nutrition — QB Elite" };
export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [, recipes, categories, videos, profileRes] = await Promise.all([
    getUserMealPlan(supabase),
    getRecipes(supabase),
    getRecipeCategories(supabase),
    getNutritionVideos(supabase),
    user
      ? supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const tier = (profileRes.data as { subscription_tier: SubscriptionTier } | null)
    ?.subscription_tier;
  const mealPlannerLocked = !tierSatisfies(tier, "starter");

  return (
    <div className="mx-auto w-full max-w-[820px] pb-2">
      <header className="px-5 pb-3 pt-1 md:px-6">
        <h1 className="text-[18px] font-bold leading-tight tracking-tight">
          Nutrition
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Daily recipes and training sessions
        </p>
      </header>

      <div className="px-4 md:px-6">
        <MealPlannerHeader locked={mealPlannerLocked} />
      </div>

      <div className="px-4 pb-1 pt-2 md:px-6">
        <ReferencesCard />
      </div>

      <NutritionTabs
        daily={
          <RecipesWithCategories recipes={recipes} categories={categories} />
        }
        training={<TrainingTab videos={videos} />}
      />
    </div>
  );
}

function MealPlannerHeader({ locked }: { locked: boolean }) {
  const href = locked ? "/paywall" : "/nutrition/meal-plan";
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-gradient-to-br from-primary/[0.06] to-[#DD5354]/[0.04] p-3 active:opacity-95"
    >
      <div className="flex items-center gap-3.5">
        <div className="overflow-hidden rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <Image
            src="/img_nutrition.png"
            alt=""
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight">Meal Planner</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Plan your breakfast, lunch &amp; dinner
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/12 text-primary">
          {locked ? (
            <Lock className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : (
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.25} />
          )}
        </span>
      </div>
    </Link>
  );
}

function ReferencesCard() {
  return (
    <a
      href="https://www.dietaryguidelines.gov/"
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-white px-3 py-2.5 active:opacity-90"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
        <BadgeCheck className="h-4 w-4" strokeWidth={2} />
      </span>
      <p className="flex-1 text-[12px] leading-snug text-muted-foreground">
        Nutrition recommendations are supported by public health sources. Tap
        to view citations.
      </p>
      <ExternalLink className="h-4 w-4 shrink-0 self-center text-primary" strokeWidth={2} />
    </a>
  );
}

function TrainingTab({ videos }: { videos: NutritionVideo[] }) {
  return (
    <div className="px-4 pt-3 md:px-6">
      {videos.length === 0 ? (
        <div className="flex flex-col items-center px-10 py-12 text-center">
          <Video className="h-16 w-16 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] font-medium text-muted-foreground">
            No nutrition video found
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {videos.map((v) => (
            <VideoRow key={v.id} video={v} />
          ))}
        </ul>
      )}
    </div>
  );
}

function VideoRow({ video }: { video: NutritionVideo }) {
  const thumb = vimeoThumbnailUrl(video.videoLink);
  return (
    <li>
      <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#E8EDF2]">
          {thumb && (
            <Image src={thumb} alt="" fill className="object-cover" sizes="100px" />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
            Nutrition
          </p>
          <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight">
            {video.title}
          </p>
        </div>
      </div>
    </li>
  );
}
