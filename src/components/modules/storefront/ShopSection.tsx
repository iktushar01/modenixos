"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, PackageOpen } from "lucide-react";
import { Category, Collection, Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import {
  countActiveFilters,
  extractShopFacets,
  filterAndSortProducts,
  hasShopFilters,
  parseShopFilters,
  shopFiltersToSearchParams,
  ShopFilters,
} from "@/lib/shopFilters";
import { ShopFilterSidebar, ShopActiveFilters } from "./ShopFilterSidebar";
import { ProductCard } from "./ProductCard";
import {
  StorefrontCarousel,
  StorefrontCarouselHeaderAction,
  StorefrontCarouselSlide,
  StorefrontCarouselTrack,
  StorefrontSection,
} from "./ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetTitle, SheetTrigger, StorefrontSheetContent } from "@/components/modules/storefront/StorefrontSheet";
import { useOptionalStorefrontNav } from "@/components/modules/storefront/StorefrontNavContext";
import { storeShopPath } from "@/lib/storePaths";

interface ShopSectionProps {
  store: Store;
  theme: StorefrontThemeConfig;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
  showFilters?: boolean;
  layout?: "grid" | "carousel";
  /** When true, catalog is already filtered server-side (shop page) */
  serverFiltered?: boolean;
  fixedFilters?: Partial<ShopFilters>;
}

export function ShopSection({
  store,
  theme,
  catalog,
  categories,
  collections,
  ratings,
  onQuickView,
  showFilters = true,
  layout = "grid",
  serverFiltered = false,
  fixedFilters,
}: ShopSectionProps) {
  const router = useRouter();
  const storefrontNav = useOptionalStorefrontNav();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => ({ ...parseShopFilters(searchParams), ...fixedFilters }),
    [searchParams, fixedFilters],
  );
  const categoryScopedCatalog = useMemo(() => {
    if (!filters.category) return catalog;
    return filterAndSortProducts(catalog, { sort: "newest", category: filters.category }, categories);
  }, [catalog, categories, filters.category]);

  const facets = useMemo(() => extractShopFacets(categoryScopedCatalog), [categoryScopedCatalog]);
  const filtered = useMemo(
    () => (serverFiltered ? catalog : filterAndSortProducts(catalog, filters, categories)),
    [catalog, categories, filters, serverFiltered],
  );
  const activeCount = countActiveFilters(filters);
  const isFiltered = hasShopFilters(filters);

  const isShopPage = pathname.endsWith("/shop");

  const pushFilters = useCallback(
    (next: ShopFilters) => {
      const qs = shopFiltersToSearchParams(next).toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      const target = isShopPage ? href : qs ? `${pathname}?${qs}#shop` : `${pathname}#shop`;
      if (storefrontNav) {
        storefrontNav.navigate(target);
      } else {
        startTransition(() => router.push(target, { scroll: false }));
      }
    },
    [pathname, router, storefrontNav, isShopPage],
  );

  const patchFilters = useCallback(
    (patch: Partial<ShopFilters>) => {
      pushFilters({ ...filters, ...patch });
    },
    [filters, pushFilters],
  );

  const clearFilters = useCallback(() => {
    const target = isShopPage ? pathname : `${pathname}#shop`;
    if (storefrontNav) {
      storefrontNav.navigate(target);
    } else {
      startTransition(() => router.push(target, { scroll: false });
    }
  }, [pathname, router, storefrontNav, isShopPage]);

  const title = useMemo(() => {
    if (layout === "carousel" && !isFiltered) return "All products";
    if (filters.category) {
      return categories.find((c) => c.slug === filters.category)?.name ?? "Shop";
    }
    if (filters.collection) {
      return collections.find((c) => c.slug === filters.collection)?.name ?? "Shop";
    }
    return isFiltered ? "Filtered results" : "All products";
  }, [filters, categories, collections, isFiltered, layout]);

  const displayProducts = layout === "carousel" && !isFiltered ? catalog : filtered;
  const pieceLabel = `${displayProducts.length} ${displayProducts.length === 1 ? "piece" : "pieces"}`;

  const sidebarProps = {
    slug: store.slug,
    currency: store.currency,
    filters,
    facets,
    categories,
    collections,
    onChange: patchFilters,
    onClear: clearFilters,
  };

  const filterAction = showFilters ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="sf-btn-outline lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="sf-primary ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <StorefrontSheetContent side="left" className="w-[min(100%,360px)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ShopFilterSidebar {...sidebarProps} />
        </div>
      </StorefrontSheetContent>
    </Sheet>
  ) : null;

  if (layout === "carousel" && !isFiltered) {
    if (catalog.length === 0) return null;

    return (
      <section id="shop" className="py-16 md:py-24">
        <StorefrontCarousel>
          <StorefrontSection
            eyebrow="Shop"
            title={title}
            subtitle={pieceLabel}
            action={
              <StorefrontCarouselHeaderAction
                viewAllHref={storeShopPath(store.slug)}
                itemCount={catalog.length}
              />
            }
          />

          <StorefrontCarouselTrack>
            {catalog.map((product) => (
              <StorefrontCarouselSlide key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    product={product}
                    store={store}
                    theme={theme}
                    rating={ratings[product.id]}
                    onQuickView={onQuickView}
                  />
                </motion.div>
              </StorefrontCarouselSlide>
            ))}
          </StorefrontCarouselTrack>
        </StorefrontCarousel>
      </section>
    );
  }

  return (
    <StorefrontSection
      id="shop"
      className="py-16 md:py-24"
      eyebrow="Shop"
      title={title}
      subtitle={`${displayProducts.length} ${displayProducts.length === 1 ? "piece" : "pieces"}${isPending ? " · Updating…" : ""}`}
      action={filterAction}
    >
      <div className={showFilters ? "flex flex-col gap-8 lg:flex-row lg:gap-14" : ""}>
        {showFilters && (
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sf-editorial-card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
              <ShopFilterSidebar {...sidebarProps} />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {showFilters && (
            <ShopActiveFilters
              filters={filters}
              categories={categories}
              collections={collections}
              onChange={patchFilters}
            />
          )}

          {displayProducts.length === 0 ? (
            <div className="sf-editorial-card flex flex-col items-center justify-center border-dashed py-24 text-center">
              <PackageOpen className="sf-muted-fg mb-6 h-14 w-14 opacity-40" strokeWidth={1} />
              <p className="sf-display-lg text-2xl">No pieces found</p>
              <p className="sf-muted-fg mt-3 max-w-sm text-sm">
                Adjust your filters to discover more from our collection.
              </p>
              <Button variant="outline" className="sf-btn-outline mt-8 rounded-full" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 ${isPending ? "opacity-60" : ""}`}>
              {displayProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  store={store}
                  theme={theme}
                  rating={ratings[p.id]}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </StorefrontSection>
  );
}
