"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { hasShopFilters, parseShopFilters } from "@/lib/shopFilters";
import { formatPrice } from "@/lib/currency";
import { storeCategoryPath, storeCollectionPath, storeProductPath, storeShopPath } from "@/lib/storePaths";
import { StorefrontThemeShell, useStorefrontTheme } from "../../StorefrontThemeShell";
import { StorefrontNavLink } from "../../StorefrontNavLink";
import { AnnouncementBar } from "./AnnouncementBar";
import { StoreHeader } from "./StoreHeader";
import { Footer } from "./Footer";

export interface Theme3HomeProps {
  store: Store;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  reviews: Review[];
  theme: StorefrontThemeConfig;
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
  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const isShopFiltered = hasShopFilters(filters);
  const featured = useMemo(() => catalog.slice(0, 8), [catalog]);
  const heroImage = store.banner || featured[0]?.images?.[0] || null;

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

      {!isShopFiltered && (
        <section className="sf-section grid grid-cols-1 gap-5 py-8 md:grid-cols-[1.2fr_1fr] md:py-10">
          <div className="rounded-3xl border sf-border bg-card p-5 sm:p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Theme 3 Signature</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-5xl">{activeTheme.heroHeadline || store.brandName}</h1>
            <p className="mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-base">
              {activeTheme.heroSubtext || store.description || "A bold storefront designed around editorial product moments."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <StorefrontNavLink href={storeShopPath(store.slug)} className="rounded-full bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground">
                Explore catalog
              </StorefrontNavLink>
              <StorefrontNavLink
                href={collections[0] ? storeCollectionPath(store.slug, collections[0].slug) : storeShopPath(store.slug)}
                className="rounded-full border sf-border px-4 py-2 text-xs sm:text-sm font-semibold"
              >
                Featured collection
              </StorefrontNavLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border sf-border bg-card">
            {heroImage ? (
              <Image src={heroImage} alt={store.brandName} width={900} height={700} className="h-full min-h-[220px] sm:min-h-[260px] w-full object-cover" unoptimized />
            ) : (
              <div className="grid h-full min-h-[220px] sm:min-h-[260px] place-items-center text-sm text-muted-foreground">No hero image</div>
            )}
          </div>
        </section>
      )}

      {!isShopFiltered && categories.length > 0 && (
        <section className="sf-section pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Shop by category</h2>
            <StorefrontNavLink href={storeShopPath(store.slug)} className="text-xs sm:text-sm text-muted-foreground hover:underline">View all</StorefrontNavLink>
          </div>
          <div className="mt-4 flex flex-nowrap overflow-x-auto pb-2 gap-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scrollbar-none">
            {categories.slice(0, 12).map((cat) => (
              <StorefrontNavLink
                key={cat.id}
                href={storeCategoryPath(store.slug, cat.slug)}
                className="shrink-0 rounded-full border sf-border px-3.5 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em]"
              >
                {cat.name}
              </StorefrontNavLink>
            ))}
          </div>
        </section>
      )}

      <section id="shop" className="sf-section py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">{isShopFiltered ? "Filtered results" : "Curated picks"}</h2>
          <StorefrontNavLink href={storeShopPath(store.slug)} className="text-xs sm:text-sm text-muted-foreground hover:underline">Open full shop</StorefrontNavLink>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((product) => {
            const image = product.images[0] || store.banner || "";
            const sale = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : null;
            return (
              <StorefrontNavLink
                key={product.id}
                href={storeProductPath(store.slug, product.id)}
                className="group overflow-hidden rounded-xl sm:rounded-2xl border sf-border bg-card"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted/30">
                  {image ? (
                    <Image src={image} alt={product.name} width={500} height={700} className="h-full w-full object-cover transition group-hover:scale-105" unoptimized />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="p-2 sm:p-3">
                  <p className="line-clamp-1 text-xs sm:text-sm font-semibold">{product.name}</p>
                  <div className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-semibold">{formatPrice(sale ?? product.price, store.currency)}</span>
                    {sale && <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{formatPrice(product.price, store.currency)}</span>}
                  </div>
                </div>
              </StorefrontNavLink>
            );
          })}
        </div>
      </section>

      {!isShopFiltered && reviews.length > 0 && (
        <section className="sf-section pb-8">
          <h2 className="text-lg sm:text-xl font-semibold">Customer voices</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {reviews.slice(0, 3).map((review) => (
              <article key={review.id} className="rounded-xl sm:rounded-2xl border sf-border bg-card p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rating {review.rating}/5</p>
                <p className="mt-1.5 sm:mt-2 line-clamp-4 text-xs sm:text-sm">{review.comment}</p>
                <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground">{review.guestName || "Verified customer"}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <Footer store={store} theme={activeTheme} categories={categories} />
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
