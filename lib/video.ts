/**
 * Video source detection + ID extraction.
 *
 * Mirrors qb_elite_source/lib/src/core/utils/video_helper.dart so URLs
 * already in the database (with Vimeo's privacy-hash format) work as-is
 * on the web with no migration.
 */

export type VideoSource = "vimeo" | "youtube" | "unknown";

export interface ParsedVideo {
  source: VideoSource;
  id: string | null;
  /** Vimeo privacy hash (h= query param or path segment). Null for YouTube. */
  hash?: string | null;
}

export function parseVideoUrl(url: string | null | undefined): ParsedVideo {
  if (!url) return { source: "unknown", id: null };
  const trimmed = url.trim();

  // YouTube — covers youtube.com/watch?v=, youtu.be/, youtube.com/embed/
  const ytMatch =
    /(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i.exec(
      trimmed
    );
  if (ytMatch) {
    return { source: "youtube", id: ytMatch[1], hash: null };
  }

  // Vimeo — covers vimeo.com/{id}, vimeo.com/{id}/{hash}, player.vimeo.com/video/{id}?h={hash}
  const vimeoMatch = /vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/i.exec(
    trimmed
  );
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    let hash: string | null = vimeoMatch[2] ?? null;
    // Privacy hash can also live in a `?h=...` query param. Pull that
    // out if present and the path didn't already give us one.
    if (!hash) {
      try {
        const parsed = new URL(trimmed);
        hash = parsed.searchParams.get("h");
      } catch {
        // URL didn't parse — fine, hash stays null. Public-Vimeo videos
        // don't need it.
      }
    }
    return { source: "vimeo", id, hash };
  }

  return { source: "unknown", id: null };
}

/** Builds the canonical `player.vimeo.com` embed URL with the right query string. */
export function vimeoEmbedUrl(
  id: string,
  hash: string | null | undefined,
  opts: { autoplay?: boolean; loop?: boolean } = {}
): string {
  const params = new URLSearchParams();
  if (hash) params.set("h", hash);
  if (opts.autoplay) params.set("autoplay", "1");
  if (opts.loop) params.set("loop", "1");
  params.set("title", "0");
  params.set("byline", "0");
  params.set("portrait", "0");
  const qs = params.toString();
  return `https://player.vimeo.com/video/${id}${qs ? `?${qs}` : ""}`;
}

/** Builds the canonical `youtube.com/embed` URL. */
export function youtubeEmbedUrl(
  id: string,
  opts: { autoplay?: boolean; loop?: boolean } = {}
): string {
  const params = new URLSearchParams();
  if (opts.autoplay) params.set("autoplay", "1");
  if (opts.loop) {
    params.set("loop", "1");
    params.set("playlist", id); // YT requires this for loop to work
  }
  params.set("rel", "0");
  params.set("modestbranding", "1");
  const qs = params.toString();
  return `https://www.youtube.com/embed/${id}${qs ? `?${qs}` : ""}`;
}
