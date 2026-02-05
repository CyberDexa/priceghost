'use client';

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "glass" | "glow";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      rounded-xl font-semibold
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
      disabled:pointer-events-none disabled:opacity-50
      cursor-pointer active:scale-[0.98]
    `;
    
    const variants = {
      default: `
        bg-gradient-to-r from-emerald-500 to-emerald-600
        text-white shadow-lg shadow-emerald-500/25
        hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40
        focus-visible:ring-emerald-500
      `,
      secondary: `
        bg-zinc-800 text-zinc-100
        border border-zinc-700
        hover:bg-zinc-700 hover:border-zinc-600
        focus-visible:ring-zinc-500
      `,
      outline: `
        border border-zinc-700 bg-transparent text-zinc-300
        hover:bg-zinc-800/50 hover:text-zinc-100 hover:border-zinc-600
        focus-visible:ring-zinc-500
      `,
      ghost: `
        text-zinc-400
        hover:bg-zinc-800/50 hover:text-zinc-100
        focus-visible:ring-zinc-500
      `,
      destructive: `
        bg-gradient-to-r from-red-500 to-red-600
        text-white shadow-lg shadow-red-500/25
        hover:from-red-400 hover:to-red-500 hover:shadow-red-500/40
        focus-visible:ring-red-500
      `,
      glass: `
        bg-white/5 backdrop-blur-xl
        border border-white/10 text-zinc-100
        hover:bg-white/10 hover:border-white/20
        focus-visible:ring-white/20
      `,
      glow: `
        bg-gradient-to-r from-emerald-500 to-emerald-600
        text-white
        shadow-[0_0_20px_rgba(16,185,129,0.4)]
        hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
        focus-visible:ring-emerald-500
      `,
    };

    const sizes = {
      default: "h-11 px-5 py-2.5 text-sm",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
