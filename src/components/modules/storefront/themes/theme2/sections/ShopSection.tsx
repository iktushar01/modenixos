"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PackageOpen, SlidersHorizontal } from "lucide-react";
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
import { ShopFilterSidebar, ShopActiveFilters } from "../../../ShopFilterSidebar";
import { Theme2ProductCard } from "./Theme2ProductCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetTitle, SheetTrigger, StorefrontSheetContent } from "../../../StorefrontSheet";
import { useOptionalStorefrontNav } from "../../../StorefrontNavContext";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontNavLink } from "../../../StorefrontNavLink";

interface ShopSectionProps {
  store: Store;
  theme: StorefrontThemeConfig;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  ratings: Record<string, number>;
  onQuickView: (product: Product) => void;
  showFilters?: boolean;
  serverFiltered?: boolean;
  fixedFilters?: Partial<ShopFilters>;
}

export function ShopSection({
  store,
  catalog,
  categories,
  collections,
  ratings,
  onQuickView,
  showFilters = true,
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
      startTransition(() => router.push(target, { scroll: false }));
    }
  }, [pathname, router, storefrontNav, isShopPage]);

  const title = useMemo(() => {
    if (filters.category) {
      return categories.find((c) => c.slug === filters.category)?.name ?? "Shop";
    }
    if (filters.collection) {
      return collections.find((c) => c.slug === filters.collection)?.name ?? "Shop";
    }
    return isFiltered ? "Filtered results" : "The edit";
  }, [filters, categories, collections, isFiltered]);

  const displayProducts = filtered;

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
        <Button variant="outline" className="sf-t2-btn-ghost rounded-none border sf-border lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeCount > 0 && <span className="ml-2 sf-t2-label">{activeCount}</span>}
        </Button>
      </SheetTrigger>
      <StorefrontSheetContent side="left" className="w-[min(100%,360px)]">
        <SheetHeader className="sf-sheet-sticky top-0 z-20 border-b sf-border bg-inherit px-4 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="sf-sheet-scrollable min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <ShopFilterSidebar {...sidebarProps} />
        </div>
      </StorefrontSheetContent>
    </Sheet>
  ) : null;

  if (catalog.length === 0 && !isFiltered) return null;

  const useListLayout = !isFiltered && !isShopPage;

  return (
    <section id="shop" className="sf-t2-section">
      <div className="sf-section">
        <div className="sf-t2-section-head">
          <div>
            <p className="sf-t2-label">Shop</p>
            <h2 className="sf-t2-section-title">{title}</h2>
            <p className="sf-t2-section-sub mt-2">
              {displayProducts.length} {displayProducts.length === 1 ? "piece" : "pieces"}
              {isPending ? " · Updating…" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isFiltered && (
              <StorefrontNavLink href={storeShopPath(store.slug)} className="sf-t2-link-underline hidden sm:inline-flex">
                View all
              </StorefrontNavLink>
            )}
            {filterAction}
          </div>
        </div>

        <div className={showFilters ? "mt-10 flex flex-col gap-8 lg:flex-row lg:gap-14" : "mt-10"}>
          {showFilters && (
            <div className="hidden w-72 shrink-0 lg:block xl:w-80">
              <div className="sf-t2-filter-panel sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
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
              <div className="sf-t2-empty-state">
                <PackageOpen className="mb-4 h-12 w-12 opacity-40" strokeWidth={1} />
                <p className="sf-t2-section-title text-2xl">No pieces found</p>
                <p className="sf-t2-section-sub mt-2">Try adjusting your filters.</p>
                <button type="button" className="sf-t2-btn-primary mt-6" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : useListLayout ? (
              <div className={cnList(isPending)}>
                {displayProducts.slice(0, 8).map((p) => (
                  <Theme2ProductCard
                    key={p.id}
                    product={p}
                    store={store}
                    rating={ratings[p.id]}
                    onQuickView={onQuickView}
                    variant="list"
                  />
                ))}
              </div>
            ) : (
              <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${isPending ? "opacity-60" : ""}`}>
                {displayProducts.map((p) => (
                  <Theme2ProductCard
                    key={p.id}
                    product={p}
                    store={store}
                    rating={ratings[p.id]}
                    onQuickView={onQuickView}
                    variant="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function cnList(isPending: boolean) {
  return isPending ? "opacity-60" : "";
}
