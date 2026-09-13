import type { Metadata } from 'next';
import ServiceDetailPage from './ServiceDetailPage';
import { services } from '@/lib/services';
import { serviceImages, servicePhotos } from '@/lib/project-images';
import { SITE_URL } from '@/lib/site-url';

type ServiceSlug = 'civil-construction' | 'retaining-piling' | 'earthworks' | 'trenching';

// Detail copy uses the capabilities already published on the services hub.
const detailCopy: Record<ServiceSlug, string> = {
  'civil-construction': 'Our civil construction work spans road construction and surfacing, kerb and channel installation, retaining structures, concrete works, ground improvement and utility installation. Contact our team to discuss the scope, location and timing of your project.',
  'retaining-piling': 'Our retaining wall capabilities include timber and concrete retaining walls, along with gabion and crib wall construction. Contact our team to discuss your retaining or piling project, site conditions and engineering requirements.',
  earthworks: 'Our earthworks and pavement capabilities cover cut and fill, compaction, subgrade preparation, pavement construction and surfacing, and topsoil stripping and reinstatement. Get in touch to discuss your site and the work required.',
  trenching: 'Our trenching capabilities cover open cut excavation, bedding and backfill, shoring and temporary works, and reinstatement to specification. Contact our team to discuss your utility installation, water main or service corridor project.',
};

function getService(slug: ServiceSlug) {
  const service = services.find(item => item.slug === slug);
  if (!service) throw new Error(`Missing service content for ${slug}`);
  return service;
}

export function getServiceMetadata(slug: ServiceSlug): Metadata {
  const service = getService(slug);
  const url = `${SITE_URL}/services/${slug}`;
  const title = `${service.title} Wellington`;
  return {
    title,
    description: service.description,
    alternates: { canonical: url },
    openGraph: { title, description: service.description, url, type: 'website' },
  };
}

export default function ServiceRoute({ slug }: { slug: ServiceSlug }) {
  const service = getService(slug);
  return (
    <ServiceDetailPage
      slug={slug}
      number={String(services.indexOf(service) + 1).padStart(2, '0')}
      title={service.title}
      accent={service.accent}
      description={service.description}
      longDescription={detailCopy[slug]}
      image={serviceImages[slug]}
      capabilities={service.capabilities}
      keywords={`${service.title}, Wellington`}
      slideshowPhotos={servicePhotos[slug]}
    />
  );
}
