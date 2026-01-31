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
        <div className="min-h-screen bg-zinc-950">
          <div className="flex">
            <Sidebar />
            <main className="flex-1 lg:pl-0">
              <div className="py-6 px-4 sm:px-6 lg:px-8 pt-16 lg:pt-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </OnboardingProvider>
    </ToastProvider>
  );
}
