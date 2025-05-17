// app/sitemap.ts
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // ... (your existing loops for navbarMenu, footerLinks, otherEssentialPages) ...
  // ENSURE ALL `lastModified` are `new Date()`

  // ADD THIS CANARY ENTRY
  sitemapEntries.push({
    url: `${BASE_URL}/sitemap-test-canary-${new Date().toISOString().replace(/[:.]/g, '-')}`, // Unique URL
    lastModified: new Date(),
  });

  const uniqueSitemapEntries = Array.from(new Map(sitemapEntries.map(item => [item.url, item])).values());
  return uniqueSitemapEntries;
}