// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { navbarMenu, footerLinks } from '@/lib/menu'; // Assuming this path is correct

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // --- Process navbarMenu ---
  // Example:
  // { href: '/home', label: 'Home', icon: <HomeIcon /> },
  // { href: '/chats', label: 'Chats', icon: <MessageSquareIcon /> },
  // { href: '/calls', label: 'Calls', icon: <PhoneIcon /> },
  // { href: '/notifications', label: 'Notifications', icon: <BellIcon /> },
  // { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  navbarMenu.forEach((item) => {
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(), // CRITICAL: Relies on Vercel env providing correct date
      changeFrequency: 'daily', // Main navigation, likely updated or content within changes
      priority: 0.9,          // High priority for navigation items
    });
  });

  // --- Process footerLinks ---
  // Example:
  // { href: "/about", label: "About" },
  // { href: "/faq", label: "FAQs" },
  // { href: "/terms-and-conditions", label: "Terms & Conditions" },
  // { href: "/privacy-policy", label: "Privacy Policy" },
  // { href: "/sitemap.xml", label: "Sitemap" }, // This will be skipped
  // { href:"/contacts", label: "Contacts"}
  footerLinks.forEach((item) => {
    // Skip the sitemap link itself
    if (item.href.toLowerCase() === '/sitemap' || item.href.toLowerCase() === '/sitemap.xml') {
      return;
    }
    sitemapEntries.push({
      url: `${BASE_URL}${item.href}`,
      lastModified: new Date(), // CRITICAL: Relies on Vercel env providing correct date
      changeFrequency: 'monthly', // Legal/info pages tend to change less frequently
      priority: 0.5,           // Lower priority than main app pages
    });
  });

  // --- Define other essential pages ---
  // Pages like signin/signout have been removed as per request.
  // The homepage is often the most important.
  const otherEssentialPages: Array<{
    href: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { href: '/', priority: 1.0, changeFrequency: 'daily' },
    // Add any other important static pages here that are not in menus
    // e.g., { href: '/features', priority: 0.8, changeFrequency: 'weekly' },
  ];

  otherEssentialPages.forEach((page) => {
    // Add if not already present (though deduplication will handle it later too)
    // This check is mostly redundant if deduplication is solid, but doesn't hurt.
    if (!sitemapEntries.some(entry => entry.url === `${BASE_URL}${page.href}`)) {
      sitemapEntries.push({
        url: `${BASE_URL}${page.href}`,
        lastModified: new Date(), // CRITICAL: Relies on Vercel env providing correct date
        priority: page.priority,
        changeFrequency: page.changeFrequency,
      });
    }
  });

  // --- Deduplicate entries by URL ---
  // This ensures each URL appears only once. If a URL was added multiple times
  // (e.g. if '/' was also in navbarMenu), this Map approach keeps the last one
  // encountered by default. You might adjust if a specific order or merge strategy is needed.
  const uniqueSitemapEntries = Array.from(
    new Map(sitemapEntries.map(item => [item.url, item])).values()
  );

  // --- Optional Canary Test (remove once the date issue is resolved) ---
  // console.log('SITEMAP_TS: new Date() is:', new Date().toISOString()); // Add this line for Vercel build log debugging
  // uniqueSitemapEntries.push({
  //   url: `${BASE_URL}/sitemap-canary-test-${new Date().toISOString().replace(/[:.]/g, '-')}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'never',
  //   priority: 0.1,
  // });

  return uniqueSitemapEntries;
}