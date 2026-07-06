"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { getMyOrderAction } from "@/actions/storefront-orders.actions";
import StorefrontOrderDetailClient from "@/components/modules/storefront/account/StorefrontOrderDetailClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";
import { Order } from "@/types/store.types";

export default function OrderDetailPageClient({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const { slug, store, categories, customer, customerReady, storeReady } = useStorefront();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!storeReady || !customerReady) return;
    if (!customer) {
      router.replace(
        `/store/${slug}/account/login?next=/account/orders/${encodeURIComponent(orderNumber)}`,
      );
      return;
    }
    getMyOrderAction(slug, decodeURIComponent(orderNumber))
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [customer, customerReady, orderNumber, router, slug, storeReady]);

  if (!storeReady || !store || !customerReady || !customer || order === undefined) {
    return <StorefrontOrdersSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="text-muted-foreground">We could not find this order.</p>
      </div>
    );
  }

  return <StorefrontOrderDetailClient store={store} categories={categories} order={order} />;
}
