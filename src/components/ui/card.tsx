'use client';

import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "solid" | "interactive";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variants = {
    default: `
      rounded-2xl border border-zinc-800/50 
      bg-gradient-to-b from-zinc-900/90 to-zinc-900/50
      backdrop-blur-xl shadow-xl shadow-black/20
    `,
    glass: `
      rounded-2xl border border-white/10
      bg-white/5 backdrop-blur-xl
      shadow-xl shadow-black/20
    `,
    solid: `
      rounded-2xl border border-zinc-800
      bg-zinc-900 shadow-lg shadow-black/20
    `,
    interactive: `
      rounded-2xl border border-zinc-800/50
      bg-gradient-to-b from-zinc-900/90 to-zinc-900/50
      backdrop-blur-xl shadow-xl shadow-black/20
      transition-all duration-200 ease-out
      hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-black/30
      hover:-translate-y-0.5 cursor-pointer
    `,
  };

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-zinc-400", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}
