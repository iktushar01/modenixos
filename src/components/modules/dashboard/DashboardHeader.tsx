"use client";

import { ModeToggle } from "@/components/shared/modeToggle";
import { cn } from "@/lib/utils";

export function DashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-4 sm:h-16",
        "bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      <ModeToggle />
    </header>
  );
}
