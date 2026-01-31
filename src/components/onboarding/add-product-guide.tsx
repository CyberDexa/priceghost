'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Link, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface AddProductGuideProps {
  onComplete?: () => void;
}

export function AddProductGuide({ onComplete }: AddProductGuideProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product');
      }

      setSuccess(true);
      setTimeout(() => {
        onComplete?.();
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const exampleUrls = [
    { name: 'Amazon', example: 'amazon.com/dp/...' },
    { name: 'Walmart', example: 'walmart.com/ip/...' },
    { name: 'Best Buy', example: 'bestbuy.com/...' },
    { name: 'Target', example: 'target.com/p/...' },
  ];

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Product Added!</h3>
        <p className="text-zinc-400">We&apos;ll start tracking the price right away.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 mx-auto bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
          <Package className="w-7 h-7 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Add Your First Product</h3>
        <p className="text-zinc-400">Paste a product URL from any supported store</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Product URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding Product...
            </>
          ) : (
            <>
              Add Product
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Supported stores */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center mb-3">Supported stores:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleUrls.map((store) => (
            <span
              key={store.name}
              className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400"
            >
              {store.name}
            </span>
          ))}
          <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
            + any website
          </span>
        </div>
      </div>
    </div>
  );
}
