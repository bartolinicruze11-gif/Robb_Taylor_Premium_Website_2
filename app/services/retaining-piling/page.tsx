import ServiceRoute, { getServiceMetadata } from '@/components/services/ServiceRoute';

export const metadata = getServiceMetadata('retaining-piling');

export default function Page() {
  return <ServiceRoute slug="retaining-piling" />;
}
