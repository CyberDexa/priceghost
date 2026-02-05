import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Ghost, 
  TrendingDown, 
  Bell, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Store,
  ChartLine,
  Target
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
                <Ghost className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-xl font-bold">PriceGhost</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="glow">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
            <Sparkles className="h-4 w-4" />
            <span>Smart price tracking powered by AI</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Never Miss a{" "}
            <span className="gradient-text">Price Drop</span>
            <br />
            Again
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Track prices across Amazon, Walmart, Best Buy, and thousands more. 
            Get instant alerts when prices drop. Save money effortlessly.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/signup">
              <Button size="lg" variant="glow" className="text-lg px-8 py-6 group">
                Start Tracking for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              No credit card required
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex items-center justify-center gap-8 text-zinc-600 text-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Price Monitoring</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>10,000+ Stores</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Instant Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Three simple steps to start saving money on every purchase
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-8 hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-emerald-400" />
                </div>
                <span className="text-emerald-500 text-sm font-semibold mb-2 block">Step 1</span>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Paste a URL
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Copy any product link from Amazon, Walmart, Best Buy, or any online store
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-8 hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <ChartLine className="h-7 w-7 text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-semibold mb-2 block">Step 2</span>
                <h3 className="text-xl font-semibold text-white mb-3">
                  We Track Prices
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  PriceGhost monitors prices 24/7 and records the price history automatically
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-8 hover:border-zinc-700/80 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Bell className="h-7 w-7 text-amber-400" />
                </div>
                <span className="text-amber-400 text-sm font-semibold mb-2 block">Step 3</span>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Get Notified
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Receive instant email alerts when prices drop below your target
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-4 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Save
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Powerful features to help you track prices and never overpay
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingDown, title: "Price History", desc: "View complete price history charts to spot the best time to buy" },
              { icon: Bell, title: "Smart Alerts", desc: "Get notified via email when prices drop to your target" },
              { icon: Store, title: "10,000+ Stores", desc: "Track products from Amazon, Walmart, Best Buy, and more" },
              { icon: Shield, title: "100% Free", desc: "No subscriptions, no hidden fees. Free forever." },
              { icon: Zap, title: "Browser Extension", desc: "Add products to track with one click while shopping" },
              { icon: ChartLine, title: "Analytics", desc: "See your total savings and price drop statistics" },
            ].map((feature, i) => (
              <div key={i} className="group flex gap-4 p-4 rounded-xl hover:bg-zinc-900/50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-zinc-800/50 border border-zinc-700/50 rounded-xl flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors">
                  <feature.icon className="h-5 w-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative px-8 py-16 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-emerald-100 mb-8 text-lg max-w-lg mx-auto">
                Join thousands of smart shoppers who never overpay. It&apos;s completely free.
              </p>
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-emerald-600 hover:bg-zinc-100 shadow-xl">
                  Create Free Account
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-zinc-800/50 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
              <Ghost className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-white">PriceGhost</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-zinc-300 transition-colors">Refund</Link>
          </div>
          <p className="text-sm text-zinc-600">
            © 2026 PriceGhost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
