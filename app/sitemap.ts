import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://robbtaylor.co.nz';
  const servicesDate = new Date('2026-06-01');
  const homeDate = new Date('2026-06-09');
  return [
    { url: base,                                       lastModified: homeDate,     changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/services`,                         lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/services/civil-construction`,      lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },

    { url: `${base}/services/earthworks`,              lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/services/retaining-piling`,        lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/services/trenching`,               lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/services/pipe-installation`,       lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/services/site-preparation`,        lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/contact`,                          lastModified: homeDate,     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/about`,                            lastModified: servicesDate, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${base}/privacy`,                          lastModified: new Date('2026-05-01'), changeFrequency: 'yearly', priority: 0.20 },
    { url: `${base}/terms`,                            lastModified: new Date('2026-05-01'), changeFrequency: 'yearly', priority: 0.20 },
  ];
}
