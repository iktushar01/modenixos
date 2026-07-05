"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { StorefrontSection } from "./ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetTitle, SheetTrigger, StorefrontSheetContent } from "@/components/modules/storefront/StorefrontSheet";

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
    return isFiltered ? "Filtered results" : "The edit";
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

  return (
    <StorefrontSection
      id="shop"
      className="py-16 md:py-24"
      eyebrow="Shop"
      title={title}
      subtitle={`${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}${isPending ? " · Updating…" : ""}`}
      action={filterAction}
    >
      <div className={showFilters ? "flex gap-10 lg:gap-14" : ""}>
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

          {filtered.length === 0 ? (
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
            <div className={`grid gap-8 sm:grid-cols-2 xl:grid-cols-3 ${isPending ? "opacity-60" : ""}`}>
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
    </StorefrontSection>
  );
}
