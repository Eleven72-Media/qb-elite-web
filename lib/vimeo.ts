/**
 * Extract a Vimeo video ID from any of the URL shapes admins paste:
 *   https://vimeo.com/123456789
 *   https://vimeo.com/123456789/abcdef0123          (privacy hash)
 *   https://player.vimeo.com/video/123456789
 *   https://player.vimeo.com/video/123456789?h=abc  (privacy hash)
 */
export function vimeoVideoId(url: string): string | null {
  if (!url) return null;
  const m =
    /vimeo\.com\/(?:video\/)?(\d+)/.exec(url) ||
    /player\.vimeo\.com\/video\/(\d+)/.exec(url);
  return m ? m[1]! : null;
}

/**
 * vumbnail.com is a free Vimeo thumbnail CDN — no oEmbed roundtrip
 * needed. Returns the large variant; falls back to null for unknown URLs.
 */
export function vimeoThumbnailUrl(url: string): string | null {
  const id = vimeoVideoId(url);
  return id ? `https://vumbnail.com/${id}_large.jpg` : null;
}
