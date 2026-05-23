"use client";

import { Flame, Search, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Recipe } from "../queries";

/**
 * Search bar + category carousel + filtered recipe list. Client-side
 * filtering since `recipes` is small (≤30 rows on first load) and the
 * data is fully shipped with the SSR payload.
 */
export function RecipesWithCategories({
  recipes,
  categories,
}: {
  recipes: Recipe[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (category !== "All" && (r.meal ?? "").toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (q.length > 0 && !r.title.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [recipes, query, category]);

  return (
    <>
      <div className="px-4 pb-2 pt-2 md:px-6">
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 ring-1 ring-[#D9D9D9]">
          <Search className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
          <input
            type="search"
            placeholder="Search recipes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="-mx-1 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 px-5 py-2 md:px-6">
            <Chip
              active={category === "All"}
              onClick={() => setCategory("All")}
              label="All"
            />
            {categories.map((c) => (
              <Chip
                key={c}
                active={category.toLowerCase() === c.toLowerCase()}
                onClick={() => setCategory(c)}
                label={c}
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-2 md:px-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-10 py-12 text-center">
            <Utensils className="h-16 w-16 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="mt-4 text-[15px] font-medium text-muted-foreground">
              {query
                ? `No recipes for "${query}"`
                : category === "All"
                  ? "No daily recipe found"
                  : `No ${category} recipes found`}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r) => (
              <RecipeRow key={r.id} recipe={r} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "shrink-0 rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-white shadow-sm"
          : "shrink-0 rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-foreground ring-1 ring-[#D9D9D9]"
      }
    >
      {label}
    </button>
  );
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <li>
      <Link
        href={`/nutrition/recipe/${recipe.id}`}
        className="flex gap-3 overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5 active:opacity-95"
      >
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-muted">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="88px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Utensils className="h-7 w-7" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          {recipe.meal && (
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
              {recipe.meal}
            </p>
          )}
          <p className="line-clamp-2 text-[15px] font-bold leading-tight">
            {recipe.title}
          </p>
          {(recipe.calories || recipe.protein || recipe.preparationTime) && (
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {recipe.preparationTime && <Pill>{recipe.preparationTime}</Pill>}
              {recipe.calories && (
                <Pill icon={<Flame className="h-3 w-3" strokeWidth={2} />}>
                  {recipe.calories}
                </Pill>
              )}
              {recipe.protein && <Pill>{recipe.protein}g protein</Pill>}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

function Pill({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {icon}
      {children}
    </span>
  );
}
