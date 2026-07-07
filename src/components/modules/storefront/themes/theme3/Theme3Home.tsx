"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { hasShopFilters, parseShopFilters } from "@/lib/shopFilters";
import { StorefrontThemeShell, useStorefrontTheme } from "../../StorefrontThemeShell";
import { AnnouncementBar } from "../theme1/AnnouncementBar";
import { StoreHeader } from "../theme1/StoreHeader";
import { Theme1Hero } from "../theme1/Theme1Hero";
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

export interface Theme3HomeProps {
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
  return maxPct > 0 ? `Save up to ${maxPct}% on selected drops this week` : undefined;
}

function Theme3Highlights({ productCount, categoryCount }: { productCount: number; categoryCount: number }) {
  return (
    <section className="sf-section py-6 sm:py-8">
      <div className="grid gap-3 rounded-2xl border sf-border bg-card p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Catalog</p>
          <p className="mt-1 text-2xl font-semibold">{productCount}</p>
          <p className="text-sm text-muted-foreground">Products curated for this season</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Collections</p>
          <p className="mt-1 text-2xl font-semibold">{categoryCount}</p>
          <p className="text-sm text-muted-foreground">Departments to browse quickly</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Delivery</p>
          <p className="mt-1 text-2xl font-semibold">48H</p>
          <p className="text-sm text-muted-foreground">Express shipping on featured picks</p>
        </div>
      </div>
    </section>
  );
}

function Theme3HomeContent({
  store,
  catalog,
  categories,
  collections,
  reviews,
}: Omit<Theme3HomeProps, "theme">) {
  const { activeTheme } = useStorefrontTheme();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const ratings = useMemo(() => buildRatingsMap(reviews), [reviews]);
  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const isShopFiltered = hasShopFilters(filters);
  const trendingProducts = useMemo(() => catalog.slice(0, 8), [catalog]);
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
      {!isShopFiltered && (
        <Theme3Highlights productCount={catalog.length} categoryCount={categories.length} />
      )}

      {activeTheme.sections.collections && !isShopFiltered && (
        <CollectionsGrid slug={store.slug} collections={collections} />
      )}
      {activeTheme.sections.categories && !isShopFiltered && (
        <CategoriesGrid slug={store.slug} categories={categories} />
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
          layout={isShopFiltered ? "grid" : "grid"}
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

      {activeTheme.sections.promo && !isShopFiltered && (
        <PromoBanner slug={store.slug} theme={activeTheme} fallbackText={promoFallback} />
      )}

      {activeTheme.sections.reviews && !isShopFiltered && <ReviewsCarousel reviews={reviews} />}
      {activeTheme.sections.brandStory && !isShopFiltered && (
        <BrandStory theme={activeTheme} slug={store.slug} brandName={store.brandName} />
      )}
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

export function Theme3Home({ theme, store, ...props }: Theme3HomeProps) {
  return (
    <StorefrontThemeShell theme={theme} storeSlug={store.slug}>
      <Theme3HomeContent store={store} {...props} />
    </StorefrontThemeShell>
  );
}
