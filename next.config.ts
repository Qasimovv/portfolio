import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow store badge / poster images from external hosts if you link them directly.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
