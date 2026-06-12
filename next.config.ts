import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // theconnek.in and www.theconnek.in serve the same app on Vercel.
    // Consolidate all SEO signals on the canonical host www.theconnek.com.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "theconnek.in" }],
        destination: "https://www.theconnek.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.theconnek.in" }],
        destination: "https://www.theconnek.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
