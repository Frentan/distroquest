import type { APIRoute } from 'astro';

// Keep the unfinished, noindex quiz out. Add static content/result routes as they ship.
export const GET: APIRoute = ({ site }) => {
  const urls = site
    ? `<url><loc>${new URL('/', site).href.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</loc></url>`
    : '';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
};
