"use client";

import { usePathname } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { StorefrontShellProvider } from "@/components/modules/storefront/StorefrontShellContext";
import { isStoreHomePath } from "@/lib/storefront/navigation";
import type { ReactNode } from "react";

/**
 * Keeps announcement bar, header, and footer mounted across inner-store navigations
 * so route changes only swap the main content area.
 */
export function StorefrontInnerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { slug, store, categories, storeReady } = useStorefront();
  const isHome = isStoreHomePath(pathname, slug);

  if (isHome || !storeReady || !store) {
    return <StorefrontShellProvider value={false}>{children}</StorefrontShellProvider>;
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <StorefrontShellProvider value={true}>{children}</StorefrontShellProvider>
    </StorefrontPageShell>
  );
}
