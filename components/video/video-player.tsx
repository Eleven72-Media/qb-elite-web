import { parseVideoUrl, vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

/**
 * Shared video player. Supports Vimeo (incl. privacy-hash links) +
 * YouTube. Renders a 16:9 responsive iframe sized to the parent.
 *
 * Usage:
 *   <VideoPlayer src={training.videoLink} autoplay />
 *
 * Sprint 4+ may add a custom controls overlay + completion-tracking
 * event listener (Vimeo Player.js / YouTube IFrame API). For Sprint 3
 * the bare iframe is sufficient — both providers ship native controls,
 * and tap-to-complete writes can be triggered from a separate "Mark
 * Complete" button below the player.
 */
export function VideoPlayer({
  src,
  autoplay = false,
  loop = false,
  className,
}: {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
}) {
  const parsed = parseVideoUrl(src);

  if (parsed.source === "unknown" || !parsed.id) {
    return (
      <div
        className={
          "flex aspect-video w-full items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground " +
          (className ?? "")
        }
      >
        Unsupported or missing video link.
      </div>
    );
  }

  const embedUrl =
    parsed.source === "vimeo"
      ? vimeoEmbedUrl(parsed.id, parsed.hash, { autoplay, loop })
      : youtubeEmbedUrl(parsed.id, { autoplay, loop });

  return (
    <div
      className={
        "relative aspect-video w-full overflow-hidden rounded-xl bg-black " +
        (className ?? "")
      }
    >
      <iframe
        src={embedUrl}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        title="Video"
      />
    </div>
  );
}
