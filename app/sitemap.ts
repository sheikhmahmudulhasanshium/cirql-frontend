// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/faq', '/privacy-policy', '/contacts', '/terms-and-conditions'];
  // Add any other public, indexable routes

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily', // Adjust as needed per page
    priority: route === '' ? 1 : 0.8, // Adjust as needed
  }));
}