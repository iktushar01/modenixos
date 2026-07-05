"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { hasShopFilters, parseShopFilters } from "@/lib/shopFilters";
import { StorefrontThemeShell, useStorefrontTheme } from "../../StorefrontThemeShell";
import { AnnouncementBar } from "./AnnouncementBar";
import { StoreHeader } from "./StoreHeader";
import { Theme1Hero } from "./Theme1Hero";
import { CategoriesGrid } from "../../CategoriesGrid";
import { CollectionsGrid } from "../../CollectionsGrid";
import { ShopSection } from "../../ShopSection";
import { TrendingScroll } from "../../TrendingScroll";
import { PromoBanner } from "../../PromoBanner";
import { BrandStory } from "../../BrandStory";
import { ReviewsCarousel } from "../../ReviewsCarousel";
import { NewsletterSection } from "../../NewsletterSection";
import { StoreFooter } from "../../StoreFooter";
import { QuickViewModal } from "../../QuickViewModal";

export interface Theme1HomeProps {
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

function Theme1HomeContent({
  store,
  catalog,
  categories,
  collections,
  reviews,
}: Omit<Theme1HomeProps, "theme">) {
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
      {!isShopFiltered && <Theme1Hero store={store} theme={activeTheme} />}

      {activeTheme.sections.promo && !isShopFiltered && (
        <PromoBanner slug={store.slug} theme={activeTheme} fallbackText={promoFallback} />
      )}

      {activeTheme.sections.categories && !isShopFiltered && (
        <CategoriesGrid slug={store.slug} categories={categories} />
      )}

      {activeTheme.sections.collections && !isShopFiltered && (
        <CollectionsGrid slug={store.slug} collections={collections} />
      )}

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
          layout={isShopFiltered ? "grid" : "carousel"}
        />
      )}

      {activeTheme.sections.trending && !isShopFiltered && trendingProducts.length > 0 && (
        <TrendingScroll
          store={store}
          products={trendingProducts}
          theme={activeTheme}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
        />
      )}

      {activeTheme.sections.brandStory && !isShopFiltered && (
        <BrandStory theme={activeTheme} slug={store.slug} />
      )}

      {activeTheme.sections.reviews && !isShopFiltered && <ReviewsCarousel reviews={reviews} />}

      {activeTheme.sections.newsletter && !isShopFiltered && (
        <NewsletterSection brandName={store.brandName} theme={activeTheme} />
      )}

      <StoreFooter store={store} theme={activeTheme} categories={categories} />

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

export function Theme1Home({ theme, store, ...props }: Theme1HomeProps) {
  return (
    <StorefrontThemeShell theme={theme} storeSlug={store.slug}>
      <Theme1HomeContent store={store} {...props} />
    </StorefrontThemeShell>
  );
}
