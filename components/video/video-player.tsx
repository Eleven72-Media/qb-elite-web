import { parseVideoUrl, vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

/**
 * Shared video player. Supports Vimeo (incl. privacy-hash links) +
 * YouTube. Renders a 16:9 responsive iframe sized to the parent.
 *
 * Autoplay note: iOS Safari blocks autoplay unless the video is muted.
 * When autoplay is requested we force muted=1 on the embed URL so the
 * video actually starts; the user can tap to unmute via the native
 * controls. This matches what the Flutter app does inside its in-app
 * webview.
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
          "flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground " +
          (className ?? "")
        }
      >
        Unsupported or missing video link.
      </div>
    );
  }

  const embedUrl =
    parsed.source === "vimeo"
      ? vimeoEmbedUrl(parsed.id, parsed.hash, { autoplay, loop, muted: autoplay })
      : youtubeEmbedUrl(parsed.id, { autoplay, loop, muted: autoplay });

  return (
    <div
      className={
        "relative aspect-video w-full overflow-hidden bg-black " +
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
