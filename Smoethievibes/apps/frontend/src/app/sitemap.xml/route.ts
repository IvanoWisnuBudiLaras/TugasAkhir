import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

export async function GET() {
  // Static routes — expand later to include dynamic product/category pages
  const routes = [
    '',
    'Kategori',
    'Auth',
    'Cart',
    'Contact',
    'Tentang',
    'Profile',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map((route) => {
        const url = `${baseUrl}/${route}`.replace(/\/\/$/, '/');
        return `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`;
      })
      .join('\n')}
  </urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
