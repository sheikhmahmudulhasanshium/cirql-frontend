import { NextResponse } from 'next/server';
import generateSitemap from './sitemap';

export const dynamic = 'force-dynamic'; // always generate fresh sitemap

export async function GET() {
  const sitemap = generateSitemap();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap
    .map((entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${new Date(entry.lastModified || new Date()).toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
  `)
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
