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

export default nextConfig;
