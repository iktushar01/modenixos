"use client";

import { StoreNavbar } from "./StoreNavbar";
import { StorefrontThemeShell } from "./StorefrontThemeShell";
import { parseStorefrontTheme } from "@/lib/storefront";
import { Store } from "@/types/store.types";

/** @deprecated Use StoreNavbar + StorefrontThemeShell directly */
export function StorefrontHeader({ store }: { store: Store }) {
  const theme = parseStorefrontTheme(store);
  return (
    <StorefrontThemeShell theme={theme}>
      <StoreNavbar store={store} theme={theme} />
    </StorefrontThemeShell>
  );
}
