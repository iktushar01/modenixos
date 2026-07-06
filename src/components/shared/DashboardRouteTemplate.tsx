"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getDashboardSkeletonForPath } from "@/components/shared/DashboardPageSkeleton";
import { useDashboardNav } from "@/components/shared/DashboardNavContext";

export function DashboardRouteTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { pendingHref } = useDashboardNav();

  if (pendingHref) {
    return (
      <div key={pendingHref} className="animate-in fade-in duration-100">
        {getDashboardSkeletonForPath(pendingHref)}
      </div>
    );
  }

  return (
    <div key={pathname} className="animate-in fade-in duration-150">
      {children}
    </div>
  );
}

// Re-export for pages that still import from this file
export { useDashboardReady } from "@/components/shared/DashboardNavContext";
