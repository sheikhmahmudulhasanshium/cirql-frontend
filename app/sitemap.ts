// app/sitemap.ts
import { MetadataRoute } from 'next'

// Replace with your actual base URL
const BASE_URL = 'https://cirql.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Add your static routes
  const staticRoutes = [
    '', // For the homepage
    '/about',
    '/contacts',
    '/faq',
    '/privacy-policy',
    '/terms-and-conditions',
    // Add other static page paths here, e.g., '/pricing', '/blog'
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(), // Or a more specific date if available
    changeFrequency: 'monthly' as 'monthly', // Or 'weekly', 'daily', etc.
    priority: route === '' ? 1.0 : 0.8, // Homepage higher priority
  }));

  // If you have dynamic routes (e.g., /blog/[slug], /products/[id]),
  // you'll need to fetch their data and generate URLs for them here.
  // Example for dynamic blog posts (assuming you have a way to fetch all post slugs):
  /*
  const posts = await getAllPostSlugs(); // Replace with your actual data fetching logic
  const dynamicPostUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt), // Assuming your post data has an updatedAt field
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));
  */

  return [
    ...staticUrls,
    // ...dynamicPostUrls, // Uncomment and adapt if you have dynamic routes
  ];
}