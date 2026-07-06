"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { trackGuestOrderAction } from "@/actions/storefront-orders.actions";
import OrderConfirmationClient from "@/components/modules/storefront/account/OrderConfirmationClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";
import { Order } from "@/types/store.types";

export default function OrderConfirmationPageClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const email = searchParams.get("email");
  const { slug, store, categories, storeReady } = useStorefront();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!storeReady || !store || !orderNumber || !email) return;

    trackGuestOrderAction(slug, orderNumber, email)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [email, orderNumber, slug, store, storeReady]);

  if (!orderNumber || !email) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Invalid confirmation link</h1>
        <p className="text-muted-foreground">Missing order details in the URL.</p>
      </div>
    );
  }

  if (!storeReady || !store || order === undefined) {
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

  return <OrderConfirmationClient store={store} categories={categories} order={order} />;
}
