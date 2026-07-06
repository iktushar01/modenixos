"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import StorefrontTrackOrderClient from "@/components/modules/storefront/account/StorefrontTrackOrderClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";

export default function TrackPageClient() {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return <StorefrontOrdersSkeleton />;
  }

  return <StorefrontTrackOrderClient store={store} categories={categories} />;
}
