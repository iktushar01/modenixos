"use client";

import { ModeToggle } from "@/components/shared/modeToggle";
import { cn } from "@/lib/utils";

export function DashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="dashboard-chrome-header">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">{children}</div>
      <div className="flex shrink-0 items-center gap-2 border-l border-border/50 pl-3 sm:pl-4">
        <ModeToggle />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
    </header>
  );
}
