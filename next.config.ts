import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow store badge / poster images from external hosts if you link them directly.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    // Serve the static password-gated English practice app at a clean URL.
    return [{ source: "/english/learn", destination: "/english/learn/index.html" }];
  },
  async redirects() {
    return [{ source: "/english", destination: "/english/learn", permanent: false }];
  },
};

export default nextConfig;
