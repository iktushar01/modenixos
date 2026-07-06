"use client";

import { usePathname } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { useOptionalStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { StorefrontShellProvider } from "@/components/modules/storefront/StorefrontShellContext";
import { isStoreHomePath } from "@/lib/storefront/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Keeps announcement bar, header, and footer mounted across inner-store navigations
 * so route changes only swap the main content area.
 */
export function StorefrontInnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { slug, store, categories, storeReady } = useStorefront();
  const nav = useOptionalStorefrontNav();
  const isNavigating = nav?.isNavigating ?? false;
  const isHome = isStoreHomePath(pathname, slug);

  if (isHome || !storeReady || !store) {
    return <StorefrontShellProvider value={false}>{children}</StorefrontShellProvider>;
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <StorefrontShellProvider value={true}>
        <div
          key={pathname}
          className={cn(
            "transition-opacity duration-200 ease-out motion-reduce:transition-none",
            isNavigating ? "opacity-80" : "animate-in fade-in duration-200",
          )}
        >
          {children}
        </div>
      </StorefrontShellProvider>
    </StorefrontPageShell>
  );
}
