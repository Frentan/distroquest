import type { APIRoute } from 'astro';
import { sitemapUrls } from '../routing.ts';

// Only published, indexable pages belong here; the complete quiz stays noindex.
export const GET: APIRoute = ({ site }) => {
  const urls = sitemapUrls(site)
    .map(
      (url) =>
        `<url><loc>${url.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</loc></url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
};
