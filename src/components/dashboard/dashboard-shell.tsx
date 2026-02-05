'use client';

import { ReactNode } from 'react';
import { Sidebar } from "@/components/dashboard/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { OnboardingProvider } from "@/components/onboarding";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <ToastProvider>
      <OnboardingProvider>
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
          {/* Background effects */}
          <div className="fixed inset-0 pointer-events-none">
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>
          
          <div className="relative flex">
            <Sidebar />
            <main className="flex-1 lg:pl-0 min-h-screen">
              <div className="py-8 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </OnboardingProvider>
    </ToastProvider>
  );
}
