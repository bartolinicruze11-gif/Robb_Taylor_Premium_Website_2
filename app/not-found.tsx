import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-16 bg-navy-950 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
        <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-5">
          404 Error
        </p>
        <h1 className="text-6xl lg:text-8xl font-bold text-white mb-6 leading-none">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-steel-400 text-base max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to
          the homepage or get in touch with our team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 text-sm tracking-wide transition-colors duration-150"
          >
            Back to Homepage
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white font-medium px-8 py-4 text-sm tracking-wide transition-colors duration-150"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
