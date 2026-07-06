"use client";

import type { ReactNode } from "react";
import { StorefrontNavContent } from "@/components/modules/storefront/StorefrontNavContent";
import { StorefrontNavProvider } from "@/components/modules/storefront/StorefrontNavContext";

export function StorefrontLayoutClient({ children }: { children: ReactNode }) {
  return (
    <StorefrontNavProvider>
      <StorefrontNavContent>{children}</StorefrontNavContent>
    </StorefrontNavProvider>
  );
}
