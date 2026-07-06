"use client";

import { useEffect, useMemo, useState } from "react";
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
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { parseShopFilters } from "@/lib/shopFilters";
import { Collection, Product } from "@/types/store.types";

function ShopContent({
  fixedCategory,
  fixedCollection,
}: {
  fixedCategory?: string;
  fixedCollection?: string;
}) {
  const searchParams = useSearchParams();
  const { slug, store, categories } = useStorefront();
  const { activeTheme } = useStorefrontTheme();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [dataReady, setDataReady] = useState(false);
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

  useEffect(() => {
    if (!store) return;

    let cancelled = false;
    setDataReady(false);

    const params: Record<string, string> = {
      limit: "48",
      page: searchParams.get("page") ?? "1",
    };

    if (filters.category) params.category = filters.category;
    if (filters.collection) params.collection = filters.collection;
    if (filters.size) params.size = filters.size;
    if (filters.color) params.color = filters.color;
    if (filters.tag) params.tag = filters.tag;
    if (filters.sale) params.sale = "true";
    if (filters.minPrice != null) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice != null) params.maxPrice = String(filters.maxPrice);
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;

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
        if (!cancelled) setDataReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, store, filterKey, filters]);

  if (!store || !dataReady) {
    return (
      <main className="sf-section w-full py-16 md:py-24">
        <div className="sf-skeleton mb-8 h-10 w-48 rounded" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="sf-skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
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
    </>
  );
}

export default function ShopPageClient({
  fixedCategory,
  fixedCollection,
}: {
  fixedCategory?: string;
  fixedCollection?: string;
} = {}) {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return <StorefrontHomeSkeleton />;
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <ShopContent fixedCategory={fixedCategory} fixedCollection={fixedCollection} />
    </StorefrontPageShell>
  );
}
