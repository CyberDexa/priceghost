import { Ghost, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Ghost Icon */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
          <Ghost className="w-24 h-24 text-emerald-500 relative z-10 animate-pulse" />
          <WifiOff className="w-8 h-8 text-gray-500 absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          You&apos;re Offline
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, 
          your tracked products are safe and will sync when you&apos;re back online.
        </p>
        
        {/* Suggestions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-left">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
            While you wait:
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Check your WiFi or mobile data
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Try moving closer to your router
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Restart your device if the problem persists
            </li>
          </ul>
        </div>
        
        {/* Auto-retry notice */}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
          We&apos;ll automatically reconnect when your internet is back.
        </p>
      </div>
    </div>
  );
}
