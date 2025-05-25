// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/faq', '/privacy-policy', '/contacts', '/terms-and-conditions'];

  // Get the current date
  const currentDateObject = new Date();

  // Subtract 2 days (2 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second)
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const dateTwoDaysAgo = new Date(currentDateObject.getTime() - twoDaysInMilliseconds);

  // Convert to ISO string format (UTC)
  const lastModifiedDate = dateTwoDaysAgo.toISOString();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: lastModifiedDate, // Use the date from two days ago
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}