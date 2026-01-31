import Link from 'next/link';
import { Ghost, ArrowLeft } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Ghost className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="font-bold text-gray-900">PriceGhost</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-gray-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-6">
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/refund" className="hover:text-gray-900">Refund Policy</Link>
          </div>
          <p>© 2026 PriceGhost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
