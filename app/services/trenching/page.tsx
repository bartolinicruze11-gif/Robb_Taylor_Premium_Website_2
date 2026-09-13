import ServiceRoute, { getServiceMetadata } from '@/components/services/ServiceRoute';

export const metadata = getServiceMetadata('trenching');

export default function Page() {
  return <ServiceRoute slug="trenching" />;
}
