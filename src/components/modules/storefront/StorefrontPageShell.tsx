"use client";

import { ReactNode } from "react";
import { Category, Store } from "@/types/store.types";
import { parseStorefrontTheme } from "@/lib/storefront";
import { StorefrontThemeShell } from "./StorefrontThemeShell";
import { AnnouncementBar } from "./themes/theme1/AnnouncementBar";
import { StoreHeader } from "./themes/theme1/StoreHeader";
import { StoreFooter } from "./StoreFooter";

interface StorefrontPageShellProps {
  store: Store;
  categories?: Category[];
  children: ReactNode;
}

export function StorefrontPageShell({ store, categories = [], children }: StorefrontPageShellProps) {
  const theme = parseStorefrontTheme(store);

  return (
    <StorefrontThemeShell theme={theme}>
      <AnnouncementBar theme={theme} />
      <StoreHeader store={store} theme={theme} categories={categories} />
      {children}
      <StoreFooter store={store} theme={theme} />
    </StorefrontThemeShell>
  );
}
