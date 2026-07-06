"use client";

import { Suspense } from "react";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { parseStorefrontTheme } from "@/lib/storefront";
import { resolveThemeHome } from "./themes/registry";

interface StorefrontRendererProps {
  store: Store;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  reviews: Review[];
}

function ShopFallback() {
  return (
    <div id="shop" className="sf-section w-full animate-pulse py-20">
      <div className="sf-skeleton mb-8 h-10 w-48 rounded" />
      <div className="flex gap-8">
        <div className="sf-skeleton hidden h-96 w-64 rounded-2xl lg:block" />
        <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sf-skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StorefrontRenderer(props: StorefrontRendererProps) {
  const theme = parseStorefrontTheme(props.store);
  const ThemeHome = resolveThemeHome(theme.templateId);

  return (
    <Suspense fallback={<ShopFallback />}>
      <ThemeHome {...props} theme={theme} />
    </Suspense>
  );
}
