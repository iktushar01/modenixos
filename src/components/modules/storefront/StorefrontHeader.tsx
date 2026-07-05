"use client";

import { Store } from "@/types/store.types";
import { Category } from "@/types/store.types";
import { StorefrontPageShell } from "./StorefrontPageShell";

/** @deprecated Use StorefrontPageShell */
export function StorefrontHeader({
  store,
  categories = [],
  children,
}: {
  store: Store;
  categories?: Category[];
  children?: React.ReactNode;
}) {
  return (
    <StorefrontPageShell store={store} categories={categories}>
      {children}
    </StorefrontPageShell>
  );
}
