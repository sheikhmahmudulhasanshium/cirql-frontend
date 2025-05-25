// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/faq', '/privacy-policy', '/contacts', '/terms-and-conditions'];
  const testDate = '2024-01-15T10:00:00.000Z'; // A known past date

  // You can also add a log to see what the build process thinks the date is
  // This log will appear in your Vercel build logs
  console.log("Sitemap generation: Forcing lastModified to:", testDate);
  const currentDateObject = new Date();
  console.log("Sitemap generation: Current new Date() on build server is:", currentDateObject.toISOString());


  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: testDate, // Use the hardcoded test date
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}