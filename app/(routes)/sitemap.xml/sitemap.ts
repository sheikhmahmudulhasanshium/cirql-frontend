import type { MetadataRoute } from 'next';
import { navbarMenu, footerLinks } from '@/lib/menu';

const BASE_URL = 'https://cirql.vercel.app';

export default function generateSitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add navbar menu items
  navbarMenu.forEach((item) => {
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    });
  });

  // Add footer links except sitemap itself
  footerLinks.forEach((item) => {
    if (item.href.toLowerCase() === '/sitemap' || item.href.toLowerCase() === '/sitemap.xml') {
      return;
    }
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    });
  });

  // Add homepage explicitly
  sitemapEntries.push({
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  });

  // Deduplicate entries by URL (keep last occurrence)
  const uniqueEntries = Array.from(
    new Map(sitemapEntries.map((entry) => [entry.url, entry])).values()
  );

  return uniqueEntries;
}
