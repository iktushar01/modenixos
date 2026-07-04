"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { Collection, Product, Review, Store } from "@/types/store.types";
import { parseStorefrontTheme } from "@/lib/storefrontTheme";
import { StoreNavbar } from "./StoreNavbar";
import { StoreHero } from "./StoreHero";
import { CollectionsGrid } from "./CollectionsGrid";
import { ProductCard } from "./ProductCard";
import { TrendingScroll } from "./TrendingScroll";
import { PromoBanner } from "./PromoBanner";
import { BrandStory } from "./BrandStory";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { NewsletterSection } from "./NewsletterSection";
import { StoreFooter } from "./StoreFooter";
import { QuickViewModal } from "./QuickViewModal";

interface StorefrontHomeClientProps {
  store: Store;
  products: Product[];
  featuredProducts: Product[];
  collections: Collection[];
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

export function StorefrontHomeClient({
  store,
  products,
  featuredProducts,
  collections,
  reviews,
}: StorefrontHomeClientProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const theme = parseStorefrontTheme(store);
  const ratings = useMemo(() => buildRatingsMap(reviews), [reviews]);

  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
  const trendingProducts = useMemo(() => {
    const featuredIds = new Set(displayFeatured.map((p) => p.id));
    return products.filter((p) => !featuredIds.has(p.id)).slice(0, 12);
  }, [products, displayFeatured]);

  const promoFallback = buildPromoFallback(products);

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={
        {
          "--store-primary": theme.primaryColor,
          "--store-secondary": theme.secondaryColor,
        } as React.CSSProperties
      }
    >
      <StoreNavbar store={store} theme={theme} />
      <StoreHero store={store} theme={theme} />

      {theme.sections.promo && (
        <PromoBanner slug={store.slug} theme={theme} fallbackText={promoFallback} />
      )}

      {theme.sections.collections && (
        <CollectionsGrid slug={store.slug} collections={collections} theme={theme} />
      )}

      {theme.sections.featured && (
        <section id="shop" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Shop</p>
            <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">Featured Products</h2>
          </motion.div>

          {displayFeatured.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
              <PackageOpen className="mb-4 h-12 w-12 text-white/25" />
              <p className="text-lg font-medium text-white/70">No products yet</p>
              <p className="mt-2 max-w-sm text-sm text-white/40">
                This store is setting up its catalog. Check back soon for new arrivals.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayFeatured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  store={store}
                  theme={theme}
                  rating={ratings[p.id]}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {theme.sections.trending && trendingProducts.length > 0 && (
        <TrendingScroll
          store={store}
          products={trendingProducts}
          theme={theme}
          ratings={ratings}
          onQuickView={setQuickViewProduct}
        />
      )}

      {theme.sections.brandStory && <BrandStory theme={theme} />}

      {theme.sections.reviews && <ReviewsCarousel reviews={reviews} />}

      {theme.sections.newsletter && (
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
    </div>
  );
}
