import withSerwistInit from "@serwist/next";

// Service worker generated from app/sw.ts via Serwist (modern, maintained
// next-pwa replacement). Source file pattern + swDest path means the
// compiled SW lands at /sw.js and is auto-registered by @serwist/next's
// runtime. Disabled in dev so we don't have to manually clear the SW cache
// every time we change a route.
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Marketing logo wall ships a mix of PNG/JPG/WebP and a handful
    // of SVGs (Hawaii, Texas A&M, Raiders, 49ers). All assets are
    // ours in /public so allowing SVG is safe; the locked-down CSP
    // strips scripts and forces image-only rendering.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Supabase Storage public bucket — admin uploads home slides + widget
      // images + recipe photos etc. here. Pattern matches any path under
      // /storage/v1/object/public/ on the project's domain.
      {
        protocol: "https",
        hostname: "rujqxxrcxsrgklqvcotr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Vimeo thumbnail CDN (for video card art on Classroom + Weight Room).
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      // YouTube thumbnail CDN (legacy mobile videos may use YouTube).
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // vumbnail.com — free Vimeo thumbnail proxy (no oEmbed needed).
      {
        protocol: "https",
        hostname: "vumbnail.com",
      },
    ],
  },
};

export default withSerwist(nextConfig);
