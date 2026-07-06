"use client";

import { useEffect, useMemo, useState } from "react";
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

const SHOP_FILTER_KEYS = [
  "category",
  "collection",
  "minPrice",
  "maxPrice",
  "size",
  "color",
  "tag",
  "sale",
  "search",
  "q",
] as const;

function hasActiveShopFilters(searchParams: URLSearchParams) {
  return SHOP_FILTER_KEYS.some((key) => {
    const value = searchParams.getAll(key);
    return value.length > 0;
  });
}

export default function StoreHomePageClient() {
  const searchParams = useSearchParams();
  const { slug, store, categories, storeReady } = useStorefront();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dataReady, setDataReady] = useState(false);

  const filterKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (!storeReady || !store) return;

    let cancelled = false;
    setDataReady(false);

    const params = new URLSearchParams(filterKey);
    const filteredShop = hasActiveShopFilters(params);

    Promise.all([
      getPublicProductsAction(slug, {
        limit: filteredShop ? "100" : "36",
        sortBy: "createdAt",
        sortOrder: "desc",
        ...(params.get("category") ? { category: params.get("category")! } : {}),
        ...(params.get("collection") ? { collection: params.get("collection")! } : {}),
      }),
      getPublicCollectionsAction(slug, { limit: "50" }),
      getPublicReviewsAction(slug, { limit: "10" }),
    ])
      .then(([catalogRes, collectionsRes, reviewsRes]) => {
        if (cancelled) return;
        setCatalog((catalogRes.data ?? []) as Product[]);
        setCollections((collectionsRes.data ?? []) as Collection[]);
        setReviews((reviewsRes.data ?? []) as Review[]);
      })
      .finally(() => {
        if (!cancelled) setDataReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, store, storeReady, filterKey]);

  if (!storeReady || !store || !dataReady) {
    return <StorefrontHomeSkeleton />;
  }

  return (
    <StorefrontHomeClient
      store={store}
      catalog={catalog}
      categories={categories}
      collections={collections}
      reviews={reviews}
    />
  );
}
