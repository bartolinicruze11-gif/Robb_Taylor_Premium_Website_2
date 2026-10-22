import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { policies } from '@/lib/policies';
export const metadata: Metadata = { title: "Privacy Policy | Robb & Taylor Contracting Ltd", description: "How we collect, use, share and retain personal information, and how to exercise your rights.", alternates: { canonical: 'https://www.robbtaylor.co.nz/privacy' }, robots: { index: true, follow: true } };
export default function Page() { return <PolicyPage policy={policies.privacy} />; }
