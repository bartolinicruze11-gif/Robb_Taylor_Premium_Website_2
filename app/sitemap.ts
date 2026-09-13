import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

// Last significant metadata update. Change this only when the associated page
// content, links, or structured data changes, never on every build/request.
const metadataUpdated = '2026-09-13';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only existing, indexable pages belong here. /projects redirects to /,
  // and /admin is private. Add service detail URLs when their routes are restored.
  return [
    { url: SITE_URL, lastModified: metadataUpdated, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: metadataUpdated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: metadataUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: metadataUpdated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: metadataUpdated, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: metadataUpdated, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
