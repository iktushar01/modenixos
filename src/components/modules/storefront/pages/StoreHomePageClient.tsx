"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getPublicProductsAction,
  getPublicCollectionsAction,
  getPublicReviewsAction,
} from "@/actions/catalog.actions";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontHomeClient } from "@/components/modules/storefront/StorefrontHomeClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { Collection, Product, Review } from "@/types/store.types";

import {
  parseShopFilters,
  shopFiltersToApiParams,
  hasActiveShopFiltersFromParams,
} from "@/lib/shopFilters";

interface StoreHomePageClientProps {
  initialCatalog?: Product[];
  initialCollections?: Collection[];
  initialReviews?: Review[];
}

export default function StoreHomePageClient({
  initialCatalog = [],
  initialCollections = [],
  initialReviews = [],
}: StoreHomePageClientProps) {
  const searchParams = useSearchParams();
  const { slug, store, categories, storeReady } = useStorefront();
  const [catalog, setCatalog] = useState<Product[]>(initialCatalog);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const skipInitialFetch = useRef(
    initialCatalog.length > 0 && !hasActiveShopFiltersFromParams(searchParams),
  );

  const filterKey = useMemo(() => searchParams.toString(), [searchParams]);
  const filteredShop = useMemo(() => hasActiveShopFiltersFromParams(searchParams), [searchParams]);
  const homeFilters = useMemo(() => parseShopFilters(searchParams), [searchParams]);

  useEffect(() => {
    if (!storeReady || !store) return;

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;
    setIsRefreshing(true);

    const params = shopFiltersToApiParams(homeFilters, {
      limit: filteredShop ? 100 : 36,
      page: 1,
    });

    Promise.all([
      getPublicProductsAction(slug, params),
      getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
      getPublicReviewsAction(slug, { limit: "10" }),
    ])
      .then(([catalogRes, collectionsRes, reviewsRes]) => {
        if (cancelled) return;
        setCatalog((catalogRes.data ?? []) as Product[]);
        setCollections((collectionsRes.data ?? []) as Collection[]);
        setReviews((reviewsRes.data ?? []) as Review[]);
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, store, storeReady, filterKey, filteredShop, homeFilters]);

  if (!storeReady || !store) {
    return <StorefrontHomeSkeleton />;
  }

  if (catalog.length === 0 && isRefreshing) {
    return <StorefrontHomeSkeleton />;
  }

  return (
    <div className={isRefreshing ? "pointer-events-none opacity-95 transition-opacity duration-200" : undefined}>
      <StorefrontHomeClient
        store={store}
        catalog={catalog}
        categories={categories}
        collections={collections}
        reviews={reviews}
      />
    </div>
  );
}
