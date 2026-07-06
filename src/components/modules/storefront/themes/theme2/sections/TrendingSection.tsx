"use client";

import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontNavLink } from "../../../StorefrontNavLink";
import { Theme2ProductCard } from "./Theme2ProductCard";
import { cn } from "@/lib/utils";

interface TrendingSectionProps {
  store: Store;
  products: Product[];
  theme: StorefrontThemeConfig;
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
}

export function TrendingSection({
  store,
  products,
  ratings,
  onQuickView,
}: TrendingSectionProps) {
  if (products.length === 0) return null;

  const bento = products.slice(0, 4);

  return (
    <section className="sf-t2-section">
      <div className="sf-section">
        <div className="sf-t2-section-head">
          <div>
            <p className="sf-t2-label">Trending</p>
            <h2 className="sf-t2-section-title">Most loved</h2>
          </div>
          <StorefrontNavLink href={storeShopPath(store.slug)} className="sf-t2-link-underline">
            Shop all
          </StorefrontNavLink>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
          {bento.map((product, i) => (
            <div
              key={product.id}
              className={cn(
                i === 0 && "sm:col-span-2 lg:row-span-2",
                i === 3 && "lg:col-span-2",
              )}
            >
              <Theme2ProductCard
                product={product}
                store={store}
                rating={ratings[product.id]}
                onQuickView={onQuickView}
                variant="bento"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
