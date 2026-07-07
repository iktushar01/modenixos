"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CreditCard,
  Download,
  ExternalLink,
  Package,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getOrderAction,
  refundOrderAction,
  retryOrderPaymentAction,
  updateOrderStatusAction,
} from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { Order } from "@/types/store.types";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

function statusBadgeClass(status: Order["status"]) {
  switch (status) {
    case "DELIVERED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "CANCELLED":
      return "border-red-500/30 bg-red-500/10 text-red-700";
    case "SHIPPED":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700";
    default:
      return "";
  }
}

async function openAuthenticatedInvoice(orderId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/invoice`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load invoice");
  const html = await res.text();
  const blob = new Blob([html], { type: "text/html" });
  window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";

  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderAction(orderId),
  });

  useEffect(() => {
    if (!order) return;
    setTrackingNumber(order.trackingNumber ?? "");
    setTrackingCarrier(order.trackingCarrier ?? "");
  }, [order]);

  const updateMutation = useMutation({
    mutationFn: (payload: {
      status: string;
      trackingNumber?: string | null;
      trackingCarrier?: string | null;
    }) => updateOrderStatusAction(orderId, payload.status, {
      trackingNumber: payload.trackingNumber,
      trackingCarrier: payload.trackingCarrier,
    }),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const refundMutation = useMutation({
    mutationFn: () => refundOrderAction(orderId),
    onSuccess: () => {
      toast.success("Order refunded");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const retryMutation = useMutation({
    mutationFn: () => retryOrderPaymentAction(orderId),
    onSuccess: (data) => {
      if (data.paymentUrl) window.location.href = data.paymentUrl;
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="dashboard-panel p-12 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Order not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const history = order.statusHistory ?? [];
  const canRefund = order.payment?.status === "PAID" && order.status !== "CANCELLED";
  const canRetryPayment =
    order.paymentMethod === "SSLCOMMERZ" &&
    (order.status === "PENDING" || order.status === "CANCELLED");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orders
          </Link>
        </Button>
        {store?.slug && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`/store/${store.slug}/account/orders/${encodeURIComponent(order.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Storefront view
            </a>
          </Button>
        )}
      </div>

      <PageHeader
        eyebrow="Orders"
        title={order.orderNumber}
        description={`Placed ${new Date(order.createdAt).toLocaleString()}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => openAuthenticatedInvoice(orderId).catch(() => toast.error("Failed to open invoice"))}>
              <Download className="mr-2 h-4 w-4" />
              Invoice
            </Button>
            {canRetryPayment && (
              <Button variant="outline" size="sm" onClick={() => retryMutation.mutate()} disabled={retryMutation.isPending}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry payment
              </Button>
            )}
            {canRefund && (
              <Button variant="outline" size="sm" onClick={() => refundMutation.mutate()} disabled={refundMutation.isPending}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Refund
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="dashboard-panel p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={cn(statusBadgeClass(order.status))}>
                {order.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{order.paymentMethod}</span>
              {order.invoiceNumber && (
                <span className="text-sm text-muted-foreground">Invoice {order.invoiceNumber}</span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={order.status}
                  onValueChange={(status) =>
                    updateMutation.mutate({
                      status,
                      trackingNumber: trackingNumber || null,
                      trackingCarrier: trackingCarrier || null,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="trackingCarrier" className="text-xs text-muted-foreground">
                    Carrier
                  </Label>
                  <Input
                    id="trackingCarrier"
                    className="mt-1"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="trackingNumber" className="text-xs text-muted-foreground">
                    Tracking number
                  </Label>
                  <Input
                    id="trackingNumber"
                    className="mt-1"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    updateMutation.mutate({
                      status: order.status,
                      trackingNumber: trackingNumber || null,
                      trackingCarrier: trackingCarrier || null,
                    })
                  }
                >
                  Save tracking
                </Button>
              </div>
            </div>
          </section>

          <section className="dashboard-panel p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h2>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      Qty {item.quantity}
                      {[item.size, item.color].filter(Boolean).length > 0 &&
                        ` · ${[item.size, item.color].filter(Boolean).join(" / ")}`}
                    </p>
                  </div>
                  <span className="tabular-nums">{formatPrice(item.price * item.quantity, currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping, currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          </section>

          {history.length > 0 && (
            <section className="dashboard-panel p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Activity</h2>
              <ol className="space-y-3">
                {history.map((entry, i) => (
                  <li key={`${entry.at}-${i}`} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{entry.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.at).toLocaleString()}
                        {entry.note ? ` · ${entry.note}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="dashboard-panel p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Customer</h2>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            {order.customerPhone && <p className="text-sm text-muted-foreground">{order.customerPhone}</p>}
            {order.customer && (
              <p className="mt-2 text-xs text-muted-foreground">
                {order.customer.orderCount} orders with this store
              </p>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </section>

          {order.payment && (
            <section className="dashboard-panel p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Payment
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium">{order.payment.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Provider</dt>
                  <dd>{order.payment.provider}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Transaction</dt>
                  <dd className="truncate font-mono text-xs">{order.payment.transactionId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd>{formatPrice(order.payment.amount, order.payment.currency || currency)}</dd>
                </div>
                {order.payment.paidAt && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Paid at</dt>
                    <dd>{new Date(order.payment.paidAt).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
