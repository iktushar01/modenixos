"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, Order, Store } from "@/types/store.types";
import { formatPrice } from "@/lib/storefrontTheme";
import { formatOrderDate } from "@/lib/storefront/orderTracking";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

export default function OrderConfirmationClient({
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
      <main className="sf-section w-full py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sf-success)_14%,transparent)]">
            <CheckCircle2 className="h-8 w-8 text-[var(--sf-success)]" />
          </div>
          <p className="sf-eyebrow">Thank you</p>
          <h1 className="sf-display-lg mt-2">Order confirmed</h1>
          <p className="sf-muted-fg mx-auto mt-3 max-w-lg text-sm">
            We&apos;ve received your order <span className="font-medium sf-fg">{order.orderNumber}</span>. A
            confirmation has been sent to {order.customerEmail}.
          </p>
          <p className="sf-muted-fg mt-1 text-xs">{formatOrderDate(order.createdAt)}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="sf-editorial-card p-6 md:p-8">
            <h2 className="sf-eyebrow mb-6">Tracking</h2>
            <OrderStatusTimeline order={order} />
          </div>

          <div className="sf-editorial-card p-6 md:p-8">
            <h2 className="sf-eyebrow mb-6">Order summary</h2>
            <ul className="space-y-3 text-sm">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex justify-between gap-4 sf-muted-fg">
                  <span className="line-clamp-1">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="sf-tabular-nums shrink-0">
                    {formatPrice(item.price * item.quantity, store.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="sf-border mt-6 flex justify-between border-t pt-5 font-medium">
              <span>Total</span>
              <span className="sf-tabular-nums sf-display-lg text-xl">
                {formatPrice(order.total, store.currency)}
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="sf-btn-primary flex-1 rounded-full">
                <Link href={`${base}/account/orders/${encodeURIComponent(order.orderNumber)}`}>View order</Link>
              </Button>
              <Button asChild variant="outline" className="sf-btn-outline flex-1 rounded-full">
                <Link href={base}>Continue shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
