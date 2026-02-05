"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { 
  Ghost, 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut,
  Bell,
  TrendingDown,
  GitCompare,
  Menu,
  X,
  BarChart3,
  HelpCircle,
  Search,
  Command,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { GlobalSearch } from "@/components/search";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Price Drops", href: "/price-drops", icon: TrendingDown },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Alerts", href: "/alerts", icon: Bell },
];

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto",
          "bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950",
          "border-r border-zinc-800/50",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800/50">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
              <Ghost className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">PriceGhost</span>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                <span>Smart Tracking</span>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="px-4 pt-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/30 border border-zinc-800 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200 cursor-pointer group"
            >
              <Search className="h-4 w-4 group-hover:text-emerald-500 transition-colors" />
              <span className="flex-1 text-left">Search products...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium bg-zinc-800 border border-zinc-700 rounded-md text-zinc-500">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Main Menu
            </p>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700/50 group-hover:text-zinc-300"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="px-4 py-4 border-t border-zinc-800/50 space-y-1.5">
            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Support
            </p>
            {bottomNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700/50 group-hover:text-zinc-300"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  {item.name}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-2 cursor-pointer group"
            >
              <div className="p-1.5 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
