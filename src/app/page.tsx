import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, TrendingDown, Bell, Zap, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <Ghost className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">PriceGhost</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Track prices on any website
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Miss a{" "}
            <span className="text-emerald-600">Price Drop</span>{" "}
            Again
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Track prices across Amazon, Walmart, Best Buy, Target, and thousands more. 
            Get instant alerts when prices drop. Save money effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Tracking for Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to start saving money on every purchase
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Paste a URL
              </h3>
              <p className="text-gray-600">
                Copy any product link from Amazon, Walmart, Best Buy, or any online store
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. We Track Prices
              </h3>
              <p className="text-gray-600">
                PriceGhost monitors prices 24/7 and records the price history automatically
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Get Notified
              </h3>
              <p className="text-gray-600">
                Receive instant email alerts when prices drop below your target or hit a new low
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Retailers */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Works with your favorite stores
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 text-4xl">
            <span title="Amazon">🛒</span>
            <span title="Walmart">🏪</span>
            <span title="Best Buy">🔵</span>
            <span title="Target">🎯</span>
            <span title="eBay">📦</span>
            <span title="Costco">🏬</span>
            <span className="text-lg text-gray-500 font-medium">+ thousands more</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of smart shoppers who never overpay
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-emerald-500" />
            <span className="text-white font-semibold">PriceGhost</span>
          </div>
          <p className="text-sm">
            © 2026 PriceGhost. Never overpay again.
          </p>
        </div>
      </footer>
    </div>
  );
}
