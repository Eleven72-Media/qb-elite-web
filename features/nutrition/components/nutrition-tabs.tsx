"use client";

import { PlayCircle, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Tab = "daily" | "training";

/**
 * Segmented red-pill tab switcher matching Flutter _NutritionTabBar:
 * "Daily Recipes" + "Training", each 45% width, icon + label, active
 * fills primary red.
 */
export function NutritionTabs({
  daily,
  training,
}: {
  daily: React.ReactNode;
  training: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("daily");
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2 px-5 py-2 md:px-6">
        <TabButton
          active={tab === "daily"}
          onClick={() => setTab("daily")}
          icon={<UtensilsCrossed className="h-[18px] w-[18px]" strokeWidth={2} />}
        >
          Daily Recipes
        </TabButton>
        <TabButton
          active={tab === "training"}
          onClick={() => setTab("training")}
          icon={<PlayCircle className="h-[18px] w-[18px]" strokeWidth={2} />}
        >
          Training
        </TabButton>
      </div>
      <div>{tab === "daily" ? daily : training}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex w-[45%] items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-[12px] font-bold transition-colors",
        active ? "bg-primary text-white" : "text-foreground/85"
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
