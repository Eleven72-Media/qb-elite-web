import { Heart, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { getUserFavorites, type FavoriteVideo } from "@/features/favorites/queries";
import { createClient } from "@/lib/supabase/server";
import { vimeoThumbnailUrl } from "@/lib/vimeo";

export const metadata = { title: "Favorites — QB Elite" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const supabase = createClient();
  const favorites = await getUserFavorites(supabase);

  return (
    <>
      <PageHeader title="Favorites" backHref="/profile" />
      <div className="mx-auto w-full max-w-[820px] px-5 pb-6 md:px-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center pt-16 text-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-10 w-10 text-primary/60" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-[20px] font-bold">No favorites yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap the heart on any video to save it here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {favorites.map((f) => (
              <FavoriteTile key={f.id} fav={f} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function FavoriteTile({ fav }: { fav: FavoriteVideo }) {
  const thumb = fav.videoLink ? vimeoThumbnailUrl(fav.videoLink) : null;
  return (
    <li>
      <Link
        href={fav.href}
        className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:opacity-95"
      >
        <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#E8EDF2]">
          {thumb && (
            <Image src={thumb} alt="" fill className="object-cover" sizes="100px" />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
              <Play className="h-5 w-5 text-white" fill="white" strokeWidth={0} />
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          {fav.subtitle && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
              {fav.subtitle}
            </p>
          )}
          <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight">
            {fav.title}
          </p>
        </div>
        <Heart className="h-5 w-5 shrink-0 fill-primary text-primary" strokeWidth={0} />
      </Link>
    </li>
  );
}
