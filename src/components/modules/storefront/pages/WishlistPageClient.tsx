"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { getWishlistAction } from "@/actions/storefront-customer.actions";
import WishlistClient from "@/components/modules/storefront/account/WishlistClient";
import { WishlistItem } from "@/types/store.types";

import { StorefrontWishlistSkeleton } from "@/components/modules/storefront/skeletons";

export default function WishlistPageClient() {
  const router = useRouter();
  const { slug, store, categories, customer, customerReady } = useStorefront();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [itemsReady, setItemsReady] = useState(false);

  useEffect(() => {
    if (!customerReady) return;
    if (!customer) {
      router.replace(`/store/${slug}/account/login`);
      return;
    }
    getWishlistAction(slug)
      .then(setItems)
      .finally(() => setItemsReady(true));
  }, [customer, customerReady, router, slug]);

  if (!customerReady || !customer || !itemsReady) {
    return <StorefrontWishlistSkeleton />;
  }

  return <WishlistClient store={store} categories={categories} items={items} />;
}
