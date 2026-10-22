import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { policies } from '@/lib/policies';
export const metadata: Metadata = { title: "Cookie Policy | Robb & Taylor Contracting Ltd", description: "Device storage, optional analytics and your measurement choices.", alternates: { canonical: 'https://www.robbtaylor.co.nz/cookies' }, robots: { index: true, follow: true } };
export default function Page() { return <PolicyPage policy={policies.cookies} />; }
