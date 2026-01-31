'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Package, Loader2, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  current_price: number | null;
  retailer: string | null;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('id, name, url, image_url, current_price, retailer')
      .eq('user_id', user.id)
      .ilike('name', `%${searchQuery}%`)
      .limit(10);

    if (!error && data) {
      setResults(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchProducts]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(`/products/${results[selectedIndex].id}`);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search your tracked products..."
            className="flex-1 py-4 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />}
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => {
                    router.push(`/products/${product.id}`);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                    index === selectedIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                  }`}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded bg-white"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      {product.current_price && (
                        <span className="text-green-400">${product.current_price.toFixed(2)}</span>
                      )}
                      {product.retailer && (
                        <span className="text-zinc-500">• {product.retailer}</span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600" />
                </button>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-zinc-600 text-sm mt-1">Try a different search term</p>
            </div>
          ) : !query ? (
            <div className="p-8 text-center">
              <p className="text-zinc-500">Start typing to search your products</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-600">
                <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd> Select</span>
                <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">Esc</kbd> Close</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
