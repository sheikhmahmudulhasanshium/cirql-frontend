// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { navbarMenu, footerLinks } from '@/lib/menu'; // Assuming this path is correct

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  navbarMenu.forEach((item) => {
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
    });
  });

  footerLinks.forEach((item) => {
    if (item.href.toLowerCase() === '/sitemap' || item.href.toLowerCase() === '/sitemap.xml') {
      return;
    }
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(),
    });
  });

  const otherEssentialPages = [
    { href: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { href: '/signin', priority: 0.5 },
    { href: '/signout', priority: 0.3 },
  ];

  otherEssentialPages.forEach((page) => {
    if (!sitemapEntries.some(entry => entry.url === `${BASE_URL}${page.href}`)) {
      sitemapEntries.push({
        url: `${BASE_URL}${page.href}`,
        lastModified: new Date(),
        priority: page.priority,
        changeFrequency: page.changeFrequency,
      });
    }
  });

  const uniqueSitemapEntries = Array.from(new Map(sitemapEntries.map(item => [item.url, item])).values());
  return uniqueSitemapEntries;
}