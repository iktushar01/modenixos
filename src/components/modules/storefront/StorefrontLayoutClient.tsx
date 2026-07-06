"use client";

import { Suspense, type ReactNode } from "react";
import { StorefrontNavContent } from "@/components/modules/storefront/StorefrontNavContent";
import { StorefrontNavProvider } from "@/components/modules/storefront/StorefrontNavContext";

function StorefrontNavShell({ children }: { children: ReactNode }) {
  return (
    <StorefrontNavProvider>
      <StorefrontNavContent>{children}</StorefrontNavContent>
    </StorefrontNavProvider>
  );
}

export function StorefrontLayoutClient({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <StorefrontNavShell>{children}</StorefrontNavShell>
    </Suspense>
  );
}
