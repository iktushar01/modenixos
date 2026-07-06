"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import CheckoutClient from "@/components/modules/storefront/CheckoutClient";
import { StorefrontCheckoutSkeleton } from "@/components/modules/storefront/skeletons";

export default function CheckoutPageClient() {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return <StorefrontCheckoutSkeleton />;
  }

  return <CheckoutClient store={store} categories={categories} />;
}
