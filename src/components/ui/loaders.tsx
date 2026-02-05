'use client';

import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
      <p className="text-zinc-400">{message}</p>
    </div>
  );
}

interface SectionLoaderProps {
  className?: string;
}

export function SectionLoader({ className = '' }: SectionLoaderProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
    </div>
  );
}

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export function InlineLoader({ size = 'md' }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return <Loader2 className={`${sizeClasses[size]} text-emerald-500 animate-spin`} />;
}

interface ButtonLoaderProps {
  className?: string;
}

export function ButtonLoader({ className = '' }: ButtonLoaderProps) {
  return <Loader2 className={`w-4 h-4 animate-spin ${className}`} />;
}
