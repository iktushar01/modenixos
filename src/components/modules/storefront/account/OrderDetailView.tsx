"use client";

import Image from "next/image";
import Link from "next/link";
import { Order, Store } from "@/types/store.types";
import { formatPrice } from "@/lib/storefrontTheme";
import {
  ORDER_STATUS_LABELS,
  formatOrderDate,
  formatShippingAddress,
  getOrderProgress,
} from "@/lib/storefront/orderTracking";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { cn } from "@/lib/utils";

interface OrderDetailViewProps {
  store: Store;
  order: Order;
  base: string;
  showBackLink?: boolean;
}

export function OrderDetailView({ store, order, base, showBackLink = true }: OrderDetailViewProps) {
  const progress = getOrderProgress(order.status);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
      <div className="space-y-8">
        <div className="sf-editorial-card overflow-hidden">
          <div className="border-b sf-border px-6 py-5 md:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="sf-eyebrow">Order</p>
                <h2 className="sf-font-display mt-1 text-2xl">{order.orderNumber}</h2>
                <p className="sf-muted-fg mt-2 text-sm">Placed {formatOrderDate(order.createdAt)}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase",
                  order.status === "CANCELLED"
                    ? "bg-[color-mix(in_srgb,var(--sf-destructive)_12%,transparent)] text-[var(--sf-destructive)]"
                    : order.status === "DELIVERED"
                      ? "bg-[color-mix(in_srgb,var(--sf-success)_12%,transparent)] text-[var(--sf-success)]"
                      : "sf-primary",
                )}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            {order.status !== "CANCELLED" && (
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs sf-muted-fg">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--sf-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--sf-primary)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-8 md:px-8">
            <h3 className="sf-eyebrow mb-6">Status timeline</h3>
            <OrderStatusTimeline order={order} />
          </div>
        </div>

        <div className="sf-editorial-card p-6 md:p-8">
          <h3 className="sf-eyebrow mb-6">Items</h3>
          <ul className="space-y-5">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-4">
                <Link
                  href={`${base}/products/${item.productId}`}
                  className="sf-muted relative block h-24 w-20 shrink-0 overflow-hidden"
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] sf-muted-fg">No image</div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`${base}/products/${item.productId}`} className="sf-font-display line-clamp-2 hover:opacity-70">
                    {item.name}
                  </Link>
                  <p className="sf-muted-fg mt-1 text-sm">
                    Qty {item.quantity}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                  </p>
                  <p className="sf-tabular-nums mt-2 text-sm font-medium">
                    {formatPrice(item.price * item.quantity, store.currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="sf-editorial-card h-fit p-6 lg:sticky lg:top-28">
          <h3 className="sf-display-lg text-xl">Summary</h3>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="sf-eyebrow">Customer</dt>
              <dd className="mt-1 font-medium">{order.customerName}</dd>
              <dd className="sf-muted-fg">{order.customerEmail}</dd>
              {order.customerPhone && <dd className="sf-muted-fg">{order.customerPhone}</dd>}
            </div>
            <div>
              <dt className="sf-eyebrow">Shipping address</dt>
              <dd className="sf-muted-fg mt-1 whitespace-pre-line leading-relaxed">
                {formatShippingAddress(order.shippingAddress)}
              </dd>
            </div>
            <div>
              <dt className="sf-eyebrow">Payment</dt>
              <dd className="mt-1">{order.paymentMethod}</dd>
              {order.payment && (
                <dd className="sf-muted-fg mt-2 space-y-1 text-sm">
                  <div>
                    Status: <span className="font-medium text-[var(--sf-fg)]">{order.payment.status}</span>
                  </div>
                  {order.payment.paidAt && (
                    <div>Paid {formatOrderDate(order.payment.paidAt)}</div>
                  )}
                  <div className="font-mono text-xs">{order.payment.transactionId}</div>
                  {order.payment.validationId && (
                    <div className="font-mono text-xs">Val: {order.payment.validationId}</div>
                  )}
                </dd>
              )}
            </div>
          </dl>
          <div className="sf-border mt-6 space-y-2 border-t pt-5 text-sm">
            <div className="flex justify-between sf-muted-fg">
              <span>Subtotal</span>
              <span className="sf-tabular-nums">{formatPrice(order.subtotal, store.currency)}</span>
            </div>
            <div className="flex justify-between sf-muted-fg">
              <span>Shipping</span>
              <span className="sf-tabular-nums">{formatPrice(order.shipping, store.currency)}</span>
            </div>
            {order.discount > 0 && (
              <div className="sf-success-text flex justify-between">
                <span>Discount</span>
                <span className="sf-tabular-nums">−{formatPrice(order.discount, store.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-base font-medium">
              <span>Total</span>
              <span className="sf-tabular-nums sf-display-lg text-xl">
                {formatPrice(order.total, store.currency)}
              </span>
            </div>
          </div>
        </div>

        {showBackLink && (
          <Link href={`${base}/account/orders`} className="sf-link inline-flex text-sm">
            ← Back to all orders
          </Link>
        )}
      </aside>
    </div>
  );
}
