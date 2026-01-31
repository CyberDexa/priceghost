'use client';

import Link from 'next/link';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated Ghost */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center animate-bounce">
            <Ghost className="w-16 h-16 text-indigo-400" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full blur-lg" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-zinc-800 mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-zinc-400 mb-8">
          Oops! This page has vanished like a ghost. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
