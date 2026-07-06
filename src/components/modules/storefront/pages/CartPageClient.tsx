"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import CartClient from "@/components/modules/storefront/CartClient";
import { StorefrontCartSkeleton } from "@/components/modules/storefront/skeletons";

export default function CartPageClient() {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return <StorefrontCartSkeleton />;
  }

  return <CartClient store={store} categories={categories} />;
}
