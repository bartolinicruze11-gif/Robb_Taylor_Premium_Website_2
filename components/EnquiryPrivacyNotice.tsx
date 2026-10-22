import Link from 'next/link';
export default function EnquiryPrivacyNotice() {
 return <p className="text-xs leading-relaxed text-white/65">We use your details to assess and respond to your enquiry. Authorised staff and service providers may receive them, including through admin email alerts. See our <Link href="/privacy" className="text-white underline underline-offset-2">Privacy Policy</Link> and <Link href="/terms" className="text-white underline underline-offset-2">enquiry terms</Link>. This does not subscribe you to unrelated marketing.</p>;
}
