import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { policies } from '@/lib/policies';
export const metadata: Metadata = { title: "Health & Safety Policy | Robb & Taylor Contracting Ltd", description: "Our approach to safe planning, site controls and shared responsibilities.", alternates: { canonical: 'https://www.robbtaylor.co.nz/safety' }, robots: { index: true, follow: true } };
export default function Page() { return <PolicyPage policy={policies.safety} />; }
