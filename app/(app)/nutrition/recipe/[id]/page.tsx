import { Clock, Drumstick, Flame } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { getRecipe } from "@/features/nutrition/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const recipe = await getRecipe(supabase, params.id);
  if (!recipe) notFound();

  return (
    <>
      <PageHeader title="Recipe" backHref="/nutrition" />
      <div className="mx-auto w-full max-w-[820px] pb-6">
        {recipe.imageUrl && (
          <div className="relative h-[260px] w-full overflow-hidden md:mx-6 md:rounded-3xl md:h-[300px] md:w-auto">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              priority
              sizes="(min-width: 768px) 760px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-5 px-5 pt-5 md:px-6">
          <header>
            {recipe.meal && (
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                {recipe.meal}
              </p>
            )}
            <h1 className="mt-1 text-[24px] font-extrabold leading-tight tracking-tight">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {recipe.description}
              </p>
            )}
          </header>

          {(recipe.calories || recipe.protein || recipe.preparationTime) && (
            <div className="flex flex-wrap gap-2.5">
              {recipe.preparationTime && (
                <Pill icon={<Clock className="h-3.5 w-3.5" strokeWidth={2} />}>
                  {recipe.preparationTime}
                </Pill>
              )}
              {recipe.calories && (
                <Pill icon={<Flame className="h-3.5 w-3.5" strokeWidth={2} />}>
                  {recipe.calories} cal
                </Pill>
              )}
              {recipe.protein && (
                <Pill icon={<Drumstick className="h-3.5 w-3.5" strokeWidth={2} />}>
                  {recipe.protein}g protein
                </Pill>
              )}
            </div>
          )}

          {recipe.ingredients.length > 0 && (
            <section>
              <h2 className="mb-3 text-[16px] font-bold tracking-tight">
                Ingredients
              </h2>
              <ul className="space-y-2 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                {recipe.ingredients.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px]">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-foreground/85">{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recipe.instructions.length > 0 && (
            <section>
              <h2 className="mb-3 text-[16px] font-bold tracking-tight">
                Instructions
              </h2>
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[14px] leading-relaxed text-foreground/85">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {recipe.ingredients.length === 0 && recipe.instructions.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
              No detail provided for this recipe yet.
            </p>
          )}
        </div>
      </div>
    </>
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
      {icon}
      {children}
    </span>
  );
}
