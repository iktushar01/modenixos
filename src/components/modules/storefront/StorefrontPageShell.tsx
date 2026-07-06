"use client";

import { ReactNode } from "react";
import { Category, Store } from "@/types/store.types";
import { parseStorefrontTheme } from "@/lib/storefront";
import { StorefrontThemeShell, useStorefrontTheme } from "./StorefrontThemeShell";
import { resolveThemeShell } from "./themes/registry";
import { StoreFooter } from "./StoreFooter";
import { useStorefrontShellProvided } from "./StorefrontShellContext";

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
  const { AnnouncementBar, StoreHeader } = resolveThemeShell(activeTheme.templateId);

  return (
    <>
      <AnnouncementBar theme={activeTheme} />
      <StoreHeader store={store} theme={activeTheme} categories={categories} />
      {children}
      <StoreFooter store={store} theme={activeTheme} categories={categories} />
    </>
  );
}

export function StorefrontPageShell({ store, categories = [], children }: StorefrontPageShellProps) {
  const shellProvided = useStorefrontShellProvided();

  if (shellProvided) {
    return <>{children}</>;
  }

  const theme = parseStorefrontTheme(store);

  return (
    <StorefrontThemeShell theme={theme} storeSlug={store.slug}>
      <StorefrontPageContent store={store} categories={categories}>
        {children}
      </StorefrontPageContent>
    </StorefrontThemeShell>
  );
}
