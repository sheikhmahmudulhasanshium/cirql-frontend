// next.config.mjs

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  
  // ADD THIS FUNCTION to solve the Cross-Origin-Opener-Policy issue
  async headers() {
    return [
      {
        // This applies the headers to all routes in your application.
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            // This value is specifically designed to allow OAuth popups to work.
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;