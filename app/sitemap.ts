// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/faq', '/privacy-policy', '/contacts', '/terms-and-conditions'];
  const currentDate = new Date().toISOString(); // Get current date in ISO format (UTC)

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate, // Use the consistent current build date
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}