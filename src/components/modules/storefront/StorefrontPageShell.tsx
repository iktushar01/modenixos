"use client";

import { ReactNode } from "react";
import { Category, Store } from "@/types/store.types";
import { parseStorefrontTheme } from "@/lib/storefront";
import { StorefrontThemeShell, useStorefrontTheme } from "./StorefrontThemeShell";
import { AnnouncementBar } from "./themes/theme1/AnnouncementBar";
import { StoreHeader } from "./themes/theme1/StoreHeader";
import { StoreFooter } from "./StoreFooter";

interface StorefrontPageShellProps {
  store: Store;
  categories?: Category[];
  children: ReactNode;
}

function StorefrontPageContent({
  store,
  categories,
  children,
}: {
  store: Store;
  categories: Category[];
  children: ReactNode;
}) {
  const { activeTheme } = useStorefrontTheme();
  return (
    <>
      <AnnouncementBar theme={activeTheme} />
      <StoreHeader store={store} theme={activeTheme} categories={categories} />
      {children}
      <StoreFooter store={store} theme={activeTheme} />
    </>
  );
}

export function StorefrontPageShell({ store, categories = [], children }: StorefrontPageShellProps) {
  const theme = parseStorefrontTheme(store);

  return (
    <StorefrontThemeShell theme={theme} storeSlug={store.slug}>
      <StorefrontPageContent store={store} categories={categories}>
        {children}
      </StorefrontPageContent>
    </StorefrontThemeShell>
  );
}
