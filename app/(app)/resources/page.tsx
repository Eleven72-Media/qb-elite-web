import Image from "next/image";
import { redirect } from "next/navigation";

import { getAthleteResources } from "@/features/resources/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Athlete Resources — QB Elite" };
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/resources");

  const resources = await getAthleteResources(supabase);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-2 pt-2 md:px-6">
      <h1 className="mb-4 text-[22px] font-bold">Athlete Resources</h1>
      {resources.length === 0 ? (
        <p className="rounded-[20px] border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
          No resources posted yet.
        </p>
      ) : (
        <div className="space-y-4">
          {resources.map((r) => (
            <a
              key={r.id}
              href={r.externalUrl || "#"}
              target={r.externalUrl ? "_blank" : undefined}
              rel="noreferrer"
              className="block overflow-hidden rounded-[20px] bg-white shadow-sm transition-transform active:scale-[0.99]"
            >
              <article className="relative h-[180px] w-full">
                {r.imageUrl ? (
                  <Image
                    src={r.imageUrl}
                    alt={r.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 600px, 100vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/5" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-base font-bold text-white drop-shadow-md">
                    {r.title}
                  </p>
                  {r.description && (
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-white/85 drop-shadow-md">
                      {r.description}
                    </p>
                  )}
                </div>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
