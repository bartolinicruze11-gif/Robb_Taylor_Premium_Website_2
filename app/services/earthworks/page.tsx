import ServiceRoute, { getServiceMetadata } from '@/components/services/ServiceRoute';

export const metadata = getServiceMetadata('earthworks');

export default function Page() {
  return <ServiceRoute slug="earthworks" />;
}
