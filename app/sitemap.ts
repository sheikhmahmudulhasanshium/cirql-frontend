// app/sitemap.ts
import { MetadataRoute } from 'next'

// Replace with your actual base URL
const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Add your static routes
  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 }, // Homepage
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contacts', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.5 },
    // Add other static page paths here, e.g., '/pricing', '/blog'
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(), // Or a more specific date if available
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'], // Corrected type assertion
    priority: route.priority,
  }));

  // If you have dynamic routes (e.g., /blog/[slug], /products/[id]),
  // you'll need to fetch their data and generate URLs for them here.
  // Example for dynamic blog posts (assuming you have a way to fetch all post slugs):
  /*
  interface PostSlug { // Define a type for your fetched post data
    slug: string;
    updatedAt: string | Date; // Or whatever type your updatedAt field is
  }
  // const posts: PostSlug[] = await getAllPostSlugs(); // Replace with your actual data fetching logic
  const dynamicPostUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'], // Corrected type assertion
    priority: 0.7,
  }));
  */

  return [
    ...staticUrls,
    // ...dynamicPostUrls, // Uncomment and adapt if you have dynamic routes
  ];
}