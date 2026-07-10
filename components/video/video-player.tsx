import { VimeoPlayer } from "@/components/video/vimeo-player";
import type { VideoTrackingType } from "@/features/video-tracking/use-video-tracking";
import { parseVideoUrl, youtubeEmbedUrl } from "@/lib/video";

/**
 * Shared video player. Supports Vimeo (incl. privacy-hash links) +
 * YouTube. Renders a 16:9 responsive iframe sized to the parent.
 *
 * Vimeo videos go through <VimeoPlayer />, which uses the Player.js SDK
 * so we can hook playback events for tracking. YouTube stays as a plain
 * iframe — YouTube is legacy on this app and not worth the IFrame API
 * integration cost for the engagement signal we're after.
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
  tracking,
}: {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  tracking?: { videoType: VideoTrackingType; videoId?: string };
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

  if (parsed.source === "vimeo") {
    return (
      <VimeoPlayer
        id={parsed.id}
        hash={parsed.hash}
        autoplay={autoplay}
        loop={loop}
        className={className}
        tracking={tracking}
      />
    );
  }

  const embedUrl = youtubeEmbedUrl(parsed.id, {
    autoplay,
    loop,
    muted: autoplay,
  });

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
