// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/faq', '/privacy-policy', '/contacts', '/terms-and-conditions'];
  const currentDate = new Date().toISOString(); // Revert to this

  // Or for "current - 2 days"
  // const currentDateObject = new Date();
  // const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  // const dateTwoDaysAgo = new Date(currentDateObject.getTime() - twoDaysInMilliseconds);
  // const currentDate = dateTwoDaysAgo.toISOString();

  console.log("Sitemap generation: Using date:", currentDate); // Keep this log for now!

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}