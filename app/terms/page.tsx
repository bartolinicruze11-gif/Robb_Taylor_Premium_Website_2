import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { policies } from '@/lib/policies';
export const metadata: Metadata = { title: "Website Terms & Conditions | Robb & Taylor Contracting Ltd", description: "Website use, enquiries, project agreements and your statutory rights.", alternates: { canonical: 'https://www.robbtaylor.co.nz/terms' }, robots: { index: true, follow: true } };
export default function Page() { return <PolicyPage policy={policies.terms} />; }
