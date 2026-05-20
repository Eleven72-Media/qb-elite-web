import type { MetadataRoute } from "next";

/**
 * Web App Manifest — generated as /manifest.webmanifest by Next.
 *
 * `display: "standalone"` is the key flag that makes the home-screen
 * shortcut on iOS / Android open without browser chrome. iOS Safari
 * additionally needs `apple-mobile-web-app-capable` meta + apple-touch-icon
 * link tags (both set in app/layout.tsx).
 *
 * `start_url` of `/home` so launching from the home screen lands a
 * logged-in user on the home tab; unauthenticated users get bounced to
 * /login by the middleware.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QB Elite",
    short_name: "QB Elite",
    description: "Quarterback training, mechanics, mindset. Become Elite.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#B61F26",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
