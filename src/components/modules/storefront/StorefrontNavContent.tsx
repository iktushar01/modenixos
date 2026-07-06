"use client";

import type { ReactNode } from "react";
import { getStorefrontSkeletonForPath } from "@/components/modules/storefront/skeletons/getStorefrontSkeletonForPath";
import { useStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";

/**
 * Shows the target route skeleton immediately on in-store navigation,
 * before Next.js finishes the client transition.
 */
export function StorefrontNavContent({ children }: { children: ReactNode }) {
  const { activePath, isNavigating } = useStorefrontNav();

  if (isNavigating) {
    return (
      <div aria-busy="true" aria-live="polite">
        {getStorefrontSkeletonForPath(activePath)}
      </div>
    );
  }

  return <>{children}</>;
}
