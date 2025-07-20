// next.config.mjs
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '*.ufs.sh' },
      
      // --- START OF FIX: Add the Vercel Blob Storage hostname ---
      // This pattern allows images from any Vercel Blob Storage URL,
      // which is where your files are being stored.
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
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