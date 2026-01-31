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
  Keyboard
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
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20">
              <Ghost className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-white">PriceGhost</span>
          </div>

          {/* Search Button */}
          <div className="px-3 pt-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search products...</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs bg-zinc-800 border border-zinc-700 rounded">
                /
              </kbd>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-zinc-500")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="px-3 py-4 border-t border-zinc-800 space-y-1">
            {/* Keyboard shortcuts hint */}
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600">
              <Keyboard className="h-3.5 w-3.5" />
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs">?</kbd>
              <span>for shortcuts</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 text-zinc-500" />
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
