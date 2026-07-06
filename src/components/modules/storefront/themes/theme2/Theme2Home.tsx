"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { hasShopFilters, parseShopFilters } from "@/lib/shopFilters";
import { StorefrontThemeShell, useStorefrontTheme } from "../../StorefrontThemeShell";
import { AnnouncementBar } from "./AnnouncementBar";
import { StoreHeader } from "./StoreHeader";
import { Theme2Hero } from "./Theme2Hero";
import {
  BrandStorySection,
  CategoriesSection,
  CollectionsSection,
  Footer,
  NewsletterSection,
  PromoSection,
  QuickViewModal,
  ReviewsSection,
  ShopSection,
  TrendingSection,
} from "./sections";

export interface Theme2HomeProps {
  store: Store;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  reviews: Review[];
  theme: StorefrontThemeConfig;
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

function buildPromoFallback(products: Product[]): string | undefined {
  let maxPct = 0;
  for (const p of products) {
    if (p.discountPrice && p.discountPrice < p.price) {
      const pct = Math.round((1 - p.discountPrice / p.price) * 100);
      if (pct > maxPct) maxPct = pct;
    }
  }
  return maxPct > 0 ? `Up to ${maxPct}% off — Limited time only` : undefined;
}

function Theme2HomeContent({
  store,
  catalog,
  categories,
  collections,
  reviews,
}: Omit<Theme2HomeProps, "theme">) {
  const { activeTheme } = useStorefrontTheme();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const ratings = useMemo(() => buildRatingsMap(reviews), [reviews]);
  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const isShopFiltered = hasShopFilters(filters);
  const trendingProducts = useMemo(() => catalog.slice(0, 12), [catalog]);
  const promoFallback = buildPromoFallback(catalog);

  useEffect(() => {
    if (!isShopFiltered || typeof window === "undefined" || window.location.hash !== "#shop") return;
    requestAnimationFrame(() => {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isShopFiltered, searchParams]);

  return (
    <>
      <AnnouncementBar theme={activeTheme} />
      <StoreHeader store={store} theme={activeTheme} categories={categories} />
      {!isShopFiltered && <Theme2Hero store={store} theme={activeTheme} />}

      {activeTheme.sections.featured && (
        <ShopSection
          store={store}
          theme={activeTheme}
          catalog={catalog}
          categories={categories}
          collections={collections}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
          showFilters={isShopFiltered}
        />
      )}

      {activeTheme.sections.promo && !isShopFiltered && (
        <PromoSection slug={store.slug} theme={activeTheme} fallbackText={promoFallback} />
      )}

      {activeTheme.sections.collections && !isShopFiltered && (
        <CollectionsSection slug={store.slug} collections={collections} />
      )}

      {activeTheme.sections.categories && !isShopFiltered && (
        <CategoriesSection slug={store.slug} categories={categories} />
      )}

      {activeTheme.sections.trending && !isShopFiltered && trendingProducts.length > 0 && (
        <TrendingSection
          store={store}
          products={trendingProducts}
          theme={activeTheme}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
        />
      )}

      {activeTheme.sections.brandStory && !isShopFiltered && (
        <BrandStorySection theme={activeTheme} slug={store.slug} brandName={store.brandName} />
      )}

      {activeTheme.sections.reviews && !isShopFiltered && <ReviewsSection reviews={reviews} />}

      {activeTheme.sections.newsletter && !isShopFiltered && (
        <NewsletterSection brandName={store.brandName} theme={activeTheme} />
      )}

      <Footer store={store} theme={activeTheme} categories={categories} />

      <QuickViewModal
        key={quickViewProduct?.id ?? "closed"}
        product={quickViewProduct}
        store={store}
        theme={activeTheme}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

export function Theme2Home({ theme, store, ...props }: Theme2HomeProps) {
  return (
    <StorefrontThemeShell theme={theme} storeSlug={store.slug}>
      <Theme2HomeContent store={store} {...props} />
    </StorefrontThemeShell>
  );
}
