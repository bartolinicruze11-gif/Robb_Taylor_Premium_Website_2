import ServiceRoute, { getServiceMetadata } from '@/components/services/ServiceRoute';

export const metadata = getServiceMetadata('civil-construction');

export default function Page() {
  return <ServiceRoute slug="civil-construction" />;
}
