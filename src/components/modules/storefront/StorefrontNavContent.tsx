"use client";

import type { ReactNode } from "react";
import { useStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import { cn } from "@/lib/utils";

/** Progress indicator during in-store client navigation. */
export function StorefrontNavContent({ children }: { children: ReactNode }) {
  const { isNavigating } = useStorefrontNav();

  return (
    <div className="relative">
      <div
        aria-hidden={!isNavigating}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[var(--sf-primary)] transition-transform duration-300 ease-out",
          isNavigating ? "scale-x-100" : "scale-x-0",
        )}
      />
      {children}
    </div>
  );
}
