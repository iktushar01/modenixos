"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { hasShopFilters, parseShopFilters } from "@/lib/shopFilters";
import { StorefrontThemeShell } from "../../StorefrontThemeShell";
import { StoreNavbar } from "../../StoreNavbar";
import { StoreHero } from "../../StoreHero";
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

/** Theme 1 — luxury fashion storefront (default) */
export function Theme1Home({
  store,
  catalog,
  categories,
  collections,
  reviews,
  theme,
}: Theme1HomeProps) {
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const ratings = useMemo(() => buildRatingsMap(reviews), [reviews]);
  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const isShopFiltered = hasShopFilters(filters);
  const trendingProducts = useMemo(() => catalog.slice(0, 12), [catalog]);
  const promoFallback = buildPromoFallback(catalog);

  return (
    <StorefrontThemeShell theme={theme}>
      <StoreNavbar store={store} theme={theme} />
      {!isShopFiltered && <StoreHero store={store} theme={theme} />}

      {theme.sections.promo && !isShopFiltered && (
        <PromoBanner slug={store.slug} theme={theme} fallbackText={promoFallback} />
      )}

      {theme.sections.categories && !isShopFiltered && (
        <CategoriesGrid slug={store.slug} categories={categories} theme={theme} />
      )}

      {theme.sections.collections && !isShopFiltered && (
        <CollectionsGrid slug={store.slug} collections={collections} theme={theme} />
      )}

      {theme.sections.featured && (
        <ShopSection
          store={store}
          theme={theme}
          catalog={catalog}
          categories={categories}
          collections={collections}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
          showFilters={false}
        />
      )}

      {theme.sections.trending && !isShopFiltered && trendingProducts.length > 0 && (
        <TrendingScroll
          store={store}
          products={trendingProducts}
          theme={theme}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
        />
      )}

      {theme.sections.brandStory && !isShopFiltered && <BrandStory theme={theme} />}

      {theme.sections.reviews && !isShopFiltered && <ReviewsCarousel reviews={reviews} />}

      {theme.sections.newsletter && !isShopFiltered && (
        <NewsletterSection brandName={store.brandName} theme={theme} />
      )}

      <StoreFooter store={store} theme={theme} />

      <QuickViewModal
        key={quickViewProduct?.id ?? "closed"}
        product={quickViewProduct}
        store={store}
        theme={theme}
        onClose={() => setQuickViewProduct(null)}
      />
    </StorefrontThemeShell>
  );
}
