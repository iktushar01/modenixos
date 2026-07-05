"use client";

import { useMemo, useState } from "react";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { ProductCard } from "../../../ProductCard";
import { QuickViewModal } from "../../../QuickViewModal";

interface RelatedProductsProps {
  store: Store;
  products: Product[];
  theme: StorefrontThemeConfig;
  reviews: Review[];
}

function buildRatingsMap(reviews: Review[]): Record<string, number> {
  const sums: Record<string, { total: number; count: number }> = {};
  for (const r of reviews) {
    if (!sums[r.productId]) sums[r.productId] = { total: 0, count: 0 };
    sums[r.productId].total += r.rating;
    sums[r.productId].count += 1;
  }
  const out: Record<string, number> = {};
  for (const [id, { total, count }] of Object.entries(sums)) {
    out[id] = total / count;
  }
  return out;
}

export function RelatedProducts({ store, products, theme, reviews }: RelatedProductsProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const ratings = useMemo(() => buildRatingsMap(reviews), [reviews]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px flex-1 sf-border bg-border" />
        <h2 className="text-sm font-bold uppercase tracking-widest sf-fg">Related Products</h2>
        <div className="h-px flex-1 sf-border bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            store={store}
            theme={theme}
            rating={ratings[p.id]}
            onQuickView={setQuickView}
          />
        ))}
      </div>
      <QuickViewModal
        product={quickView}
        store={store}
        theme={theme}
        onClose={() => setQuickView(null)}
      />
    </section>
  );
}
