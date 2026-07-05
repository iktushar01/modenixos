"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, PackageOpen } from "lucide-react";
import { Category, Collection, Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ShopSectionProps {
  store: Store;
  theme: StorefrontThemeConfig;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
  showFilters?: boolean;
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
}: ShopSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(() => parseShopFilters(searchParams), [searchParams]);
  const facets = useMemo(() => extractShopFacets(catalog), [catalog]);
  const filtered = useMemo(() => filterAndSortProducts(catalog, filters), [catalog, filters]);
  const activeCount = countActiveFilters(filters);
  const isFiltered = hasShopFilters(filters);

  const pushFilters = useCallback(
    (next: ShopFilters) => {
      const qs = shopFiltersToSearchParams(next).toString();
      const href = qs ? `${pathname}?${qs}#shop` : `${pathname}#shop`;
      startTransition(() => router.push(href, { scroll: false }));
    },
    [pathname, router],
  );

  const patchFilters = useCallback(
    (patch: Partial<ShopFilters>) => {
      pushFilters({ ...filters, ...patch });
    },
    [filters, pushFilters],
  );

  const clearFilters = useCallback(() => {
    startTransition(() => router.push(`${pathname}#shop`, { scroll: false }));
  }, [pathname, router]);

  const title = useMemo(() => {
    if (filters.category) {
      return categories.find((c) => c.slug === filters.category)?.name ?? "Shop";
    }
    if (filters.collection) {
      return collections.find((c) => c.slug === filters.collection)?.name ?? "Shop";
    }
    return isFiltered ? "Filtered results" : "All products";
  }, [filters, categories, collections, isFiltered]);

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

  return (
    <section id="shop" className="sf-section w-full py-16 md:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.2em] sf-muted-fg">Shop</p>
          <h2 className="mt-2 text-3xl font-light sf-fg md:text-4xl">{title}</h2>
          <p className="sf-muted-fg mt-2 text-sm">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {isPending && " · Updating…"}
          </p>
        </motion.div>

        {showFilters && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="sf-btn-outline lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="sf-primary ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sf-card sf-fg w-[min(100%,320px)] overflow-y-auto border sf-border">
              <SheetHeader>
                <SheetTitle className="sf-fg">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ShopFilterSidebar {...sidebarProps} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div className={showFilters ? "flex gap-8 lg:gap-10" : ""}>
        {showFilters && (
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sf-border sf-surface sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border p-5">
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

          {filtered.length === 0 ? (
            <div className="sf-border flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <PackageOpen className="sf-muted-fg mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium sf-fg">No products match your filters</p>
              <p className="sf-muted-fg mt-2 max-w-sm text-sm">Try adjusting or clearing filters to see more items.</p>
              <Button
                variant="outline"
                className="sf-btn-outline mt-6"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ${isPending ? "opacity-60" : ""}`}
            >
              {filtered.map((p) => (
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
    </section>
  );
}
