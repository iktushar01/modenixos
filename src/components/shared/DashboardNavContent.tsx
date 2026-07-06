"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getDashboardSkeletonForPath } from "@/components/shared/DashboardPageSkeleton";
import { useDashboardNav } from "@/components/shared/DashboardNavContext";

/**
 * Swaps page content for a route skeleton the moment a sidebar link is clicked,
 * before Next.js finishes the client navigation.
 */
export function DashboardNavContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activePath, isNavigating } = useDashboardNav();

  if (isNavigating && activePath !== pathname) {
    return (
      <div className="flex flex-1 flex-col" aria-busy="true" aria-live="polite">
        {getDashboardSkeletonForPath(activePath)}
      </div>
    );
  }

  return <div className="flex flex-1 flex-col">{children}</div>;
}
