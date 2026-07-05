"use client";

import Link from "next/link";
import { Category, Order, Store } from "@/types/store.types";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { AccountNav } from "./AccountNav";
import { OrderDetailView } from "./OrderDetailView";

export default function StorefrontOrderDetailClient({
  store,
  categories = [],
  order,
}: {
  store: Store;
  categories?: Category[];
  order: Order;
}) {
  const base = `/store/${store.slug}`;

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-8 space-y-6">
          <div>
            <p className="sf-eyebrow">Order tracking</p>
            <h1 className="sf-display-lg mt-2">Order details</h1>
          </div>
          <AccountNav base={base} />
        </div>
        <OrderDetailView store={store} order={order} base={base} />
      </main>
    </StorefrontPageShell>
  );
}
