// app/(routes)/sitemap.xml/sitemap.ts
import type { MetadataRoute } from 'next';
import { navbarMenu, footerLinks } from '@/lib/menu';

const BASE_URL = 'https://cirql.vercel.app';

export default function generateSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Strip icon to avoid JSX/undefined issues
  navbarMenu.forEach(({ href }) => {
    if (!href) return;
    sitemapEntries.push({
      url: `${BASE_URL}${href}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    });
  });

  footerLinks.forEach(({ href }) => {
    if (
      !href ||
      href.toLowerCase() === '/sitemap' ||
      href.toLowerCase() === '/sitemap.xml'
    ) return;

    sitemapEntries.push({
      url: `${BASE_URL}${href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    });
  });

  const essentialPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  // Merge and deduplicate
  const allPages = [...sitemapEntries, ...essentialPages];
  const uniquePages = Array.from(
    new Map(allPages.map((entry) => [entry.url, entry])).values()
  );

  return uniquePages;
}
