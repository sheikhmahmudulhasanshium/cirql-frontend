// app/(routes)/sitemap.xml/sitemap.ts
import type { MetadataRoute } from 'next';
import { navbarMenu, footerLinks } from '@/lib/menu';

const BASE_URL = 'https://cirql.vercel.app';

export default function generateSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add navbar items
  navbarMenu.forEach((item) => {
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    });
  });

  // Add footer items, excluding sitemap link
  footerLinks.forEach((item) => {
    if (
      item.href.toLowerCase() === '/sitemap' ||
      item.href.toLowerCase() === '/sitemap.xml'
    ) return;

    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    });
  });

  // Add homepage and other essentials
  const essentialPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    // Add more static pages here if needed
  ];

  // Merge and deduplicate by URL
  const allPages = [...sitemapEntries, ...essentialPages];
  const uniquePages = Array.from(
    new Map(allPages.map((entry) => [entry.url, entry])).values()
  );

  return uniquePages;
}
