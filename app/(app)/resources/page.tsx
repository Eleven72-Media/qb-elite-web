import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { getAthleteResources, type AthleteResource } from "@/features/resources/queries";
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
    <>
      <PageHeader title="Athlete Resources" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-2 md:px-6">
        {resources.length === 0 ? (
          <p className="rounded-[20px] border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
            No resources posted yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ResourceCard({ resource }: { resource: AthleteResource }) {
  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-square w-full bg-white">
        {resource.imageUrl ? (
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            fill
            className="object-contain p-2"
            sizes="(min-width: 768px) 280px, 45vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/15 to-primary/5" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 pb-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-foreground">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="line-clamp-3 text-[13px] leading-snug text-muted-foreground">
            {resource.description}
          </p>
        )}
        {resource.externalUrl && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ExternalLink className="h-4 w-4" strokeWidth={2} />
            View
          </span>
        )}
      </div>
    </article>
  );

  if (resource.externalUrl) {
    return (
      <a
        href={resource.externalUrl}
        target="_blank"
        rel="noreferrer"
        className="block active:opacity-90"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
