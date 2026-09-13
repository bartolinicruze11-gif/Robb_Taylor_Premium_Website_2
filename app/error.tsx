'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020c18] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-4">Something went wrong</p>
        <h2 className="text-white font-bold text-xl mb-3">This page couldn&apos;t be displayed</h2>
        <p className="text-[#8ba5bc] text-sm leading-relaxed mb-6">
          Please try again. If the problem continues, contact us directly and we&apos;ll help right away.
        </p>
        {error?.digest && (
          <p className="text-[#3d5668] text-[11px] font-mono tracking-wide mb-6">
            Reference: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 text-sm uppercase tracking-wider transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
