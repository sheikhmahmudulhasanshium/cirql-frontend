// next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The rewrites function is correctly removed for the new architecture.

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // --- THIS IS THE FIX ---
      // We must add the hostname for UploadThing's file storage service.
      {
        protocol: 'https',
        hostname: 'utfs.io',
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