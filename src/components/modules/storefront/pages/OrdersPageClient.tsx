"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { getMyOrdersAction } from "@/actions/storefront-orders.actions";
import StorefrontOrdersClient from "@/components/modules/storefront/account/StorefrontOrdersClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";
import { Order } from "@/types/store.types";

export default function OrdersPageClient() {
  const router = useRouter();
  const { slug, store, categories, customer, customerReady, storeReady } = useStorefront();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!storeReady || !customerReady) return;
    if (!customer) {
      router.replace(`/store/${slug}/account/login?next=/account/orders`);
      return;
    }
    getMyOrdersAction(slug)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [customer, customerReady, router, slug, storeReady]);

  if (!storeReady || !store || !customerReady || !customer || orders === null) {
    return <StorefrontOrdersSkeleton />;
  }

  return <StorefrontOrdersClient store={store} categories={categories} orders={orders} />;
}
