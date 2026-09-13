import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://robbtaylor.co.nz/sitemap.xml',
    host: 'https://robbtaylor.co.nz',
  };
}
