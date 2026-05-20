/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
