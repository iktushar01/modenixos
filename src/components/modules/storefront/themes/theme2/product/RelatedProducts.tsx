"use client";

import { useMemo, useState } from "react";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { Theme2ProductCard } from "../sections/Theme2ProductCard";
import { QuickViewModal } from "../sections/QuickViewModal";

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
    <section className="sf-t2-section mt-16 border-t sf-border pt-12">
      <div className="sf-t2-section-head mb-8">
        <p className="sf-t2-label">Related</p>
        <h2 className="sf-t2-section-title">You may also like</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Theme2ProductCard
            key={p.id}
            product={p}
            store={store}
            rating={ratings[p.id]}
            onQuickView={setQuickView}
            variant="grid"
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
