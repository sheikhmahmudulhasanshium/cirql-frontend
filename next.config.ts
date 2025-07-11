// next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      // --- ADD THIS BLOCK TO FIX THE ERROR ---
      // This allows images from any subdomain of ufs.sh,
      // which is where your error is coming from.
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
      },
      // --- END OF FIX ---
    ],
  },
  
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;