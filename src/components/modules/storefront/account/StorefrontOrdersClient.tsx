"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, Order, Store } from "@/types/store.types";
import { formatPrice } from "@/lib/storefrontTheme";
import { ORDER_STATUS_LABELS, formatOrderDate, getOrderProgress } from "@/lib/storefront/orderTracking";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { useStorefrontCustomer } from "@/components/modules/storefront/StorefrontCustomerContext";
import { AccountNav } from "./AccountNav";
import { cn } from "@/lib/utils";

export default function StorefrontOrdersClient({
  store,
  categories = [],
  orders,
}: {
  store: Store;
  categories?: Category[];
  orders: Order[];
}) {
  const { customer } = useStorefrontCustomer();
  const base = `/store/${store.slug}`;

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-8 space-y-6">
          <div>
            <p className="sf-eyebrow">Account</p>
            <h1 className="sf-display-lg mt-2">My orders</h1>
            <p className="sf-muted-fg mt-2 text-sm">
              {customer?.name ? `${customer.name} · ` : ""}
              {orders.length} orders
            </p>
          </div>
          <AccountNav base={base} />
        </div>

        {orders.length === 0 ? (
          <div className="sf-editorial-card flex flex-col items-center justify-center border-dashed py-24 text-center">
            <Package className="sf-muted-fg mb-6 h-12 w-12" strokeWidth={1.25} />
            <p className="sf-display-lg text-xl">No orders yet</p>
            <p className="sf-muted-fg mt-2 max-w-sm text-sm">
              When you place an order, it will appear here with live status updates.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="sf-btn-primary rounded-full px-8">
                <Link href={base}>Start shopping</Link>
              </Button>
              <Button asChild variant="outline" className="sf-btn-outline rounded-full">
                <Link href={`${base}/track`}>Track by order number</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const progress = getOrderProgress(order.status);
              return (
                <Link
                  key={order.id}
                  href={`${base}/account/orders/${encodeURIComponent(order.orderNumber)}`}
                  className="sf-editorial-card group block p-6 transition-shadow hover:shadow-md md:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="sf-eyebrow">Order</p>
                      <h2 className="sf-font-display mt-1 text-xl group-hover:opacity-80">{order.orderNumber}</h2>
                      <p className="sf-muted-fg mt-2 text-sm">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase",
                          order.status === "DELIVERED"
                            ? "bg-[color-mix(in_srgb,var(--sf-success)_12%,transparent)] text-[var(--sf-success)]"
                            : order.status === "CANCELLED"
                              ? "bg-[color-mix(in_srgb,var(--sf-destructive)_12%,transparent)] text-[var(--sf-destructive)]"
                              : "sf-primary",
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <p className="sf-tabular-nums mt-3 text-lg font-medium">
                        {formatPrice(order.total, store.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <p className="sf-muted-fg text-sm">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} · {order.paymentMethod}
                    </p>
                    {order.status !== "CANCELLED" && (
                      <div className="flex min-w-[180px] flex-1 items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sf-muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--sf-primary)]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="sf-muted-fg text-xs">{progress}%</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </StorefrontPageShell>
  );
}
