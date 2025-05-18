// app/(routes)/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import generateSitemap from './sitemap';

export const dynamic = 'force-dynamic'; // Optional, ensures it's always up-to-date

export async function GET() {
  const sitemap = generateSitemap();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap
    .map((entry) => {
      return `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${new Date(entry.lastModified || new Date()).toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
