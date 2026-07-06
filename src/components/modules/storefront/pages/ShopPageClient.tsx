"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getPublicProductsAction,
  getPublicCollectionsAction,
} from "@/actions/catalog.actions";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { useStorefrontTheme } from "@/components/modules/storefront/StorefrontThemeShell";
import { ShopSection } from "@/components/modules/storefront/ShopSection";
import { QuickViewModal } from "@/components/modules/storefront/QuickViewModal";
import { parseShopFilters, shopFiltersToApiParams, hasActiveShopFiltersFromParams } from "@/lib/shopFilters";
import { Collection, Product } from "@/types/store.types";

function ShopContent({
  fixedCategory,
  fixedCollection,
  initialCatalog = [],
  initialCollections = [],
  initialFilterKey = "",
}: {
  fixedCategory?: string;
  fixedCollection?: string;
  initialCatalog?: Product[];
  initialCollections?: Collection[];
  initialFilterKey?: string;
}) {
  const searchParams = useSearchParams();
  const { slug, store, categories } = useStorefront();
  const { activeTheme } = useStorefrontTheme();
  const [catalog, setCatalog] = useState<Product[]>(initialCatalog);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filters = useMemo(() => {
    const parsed = parseShopFilters(searchParams);
    return {
      ...parsed,
      category: fixedCategory ?? parsed.category,
      collection: fixedCollection ?? parsed.collection,
    };
  }, [searchParams, fixedCategory, fixedCollection]);

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const currentFilterKey = useMemo(() => searchParams.toString(), [searchParams]);
  const skipInitialFetch = useRef(
    initialCatalog.length > 0 && currentFilterKey === initialFilterKey,
  );

  useEffect(() => {
    if (!store) return;

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;
    setIsRefreshing(true);

    const params = shopFiltersToApiParams(filters, {
      limit: 48,
      page: Number(searchParams.get("page") ?? 1),
    });

    Promise.all([
      getPublicProductsAction(slug, params),
      getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
    ])
      .then(([catalogRes, collectionsRes]) => {
        if (cancelled) return;
        setCatalog((catalogRes.data ?? []) as Product[]);
        setCollections((collectionsRes.data ?? []) as Collection[]);
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, store, filterKey, filters, searchParams, currentFilterKey]);

  if (!store) return null;

  return (
    <div className={isRefreshing ? "pointer-events-none opacity-95 transition-opacity duration-200" : undefined}>
      <ShopSection
        store={store}
        theme={activeTheme}
        catalog={catalog}
        categories={categories}
        collections={collections}
        ratings={{}}
        onQuickView={setQuickViewProduct}
        showFilters
        layout="grid"
        serverFiltered
        fixedFilters={{
          ...(fixedCategory ? { category: fixedCategory } : {}),
          ...(fixedCollection ? { collection: fixedCollection } : {}),
        }}
      />
      <QuickViewModal
        key={quickViewProduct?.id ?? "closed"}
        product={quickViewProduct}
        store={store}
        theme={activeTheme}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPageClient({
  fixedCategory,
  fixedCollection,
  initialCatalog = [],
  initialCollections = [],
  initialFilterKey = "",
}: {
  fixedCategory?: string;
  fixedCollection?: string;
  initialCatalog?: Product[];
  initialCollections?: Collection[];
  initialFilterKey?: string;
} = {}) {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return null;
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <ShopContent
        fixedCategory={fixedCategory}
        fixedCollection={fixedCollection}
        initialCatalog={initialCatalog}
        initialCollections={initialCollections}
        initialFilterKey={initialFilterKey}
      />
    </StorefrontPageShell>
  );
}
