"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Order, Store } from "@/types/store.types";
import { trackGuestOrderAction } from "@/actions/storefront-orders.actions";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { AccountNav } from "./AccountNav";
import { OrderDetailView } from "./OrderDetailView";

export default function StorefrontTrackOrderClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  const base = `/store/${store.slug}`;
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ orderNumber: "", email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await trackGuestOrderAction(store.slug, form.orderNumber.trim(), form.email.trim());
      setOrder(result);
    } catch {
      toast.error("No order found. Check your order number and email.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-8 space-y-6">
          <div>
            <p className="sf-eyebrow">Guest tracking</p>
            <h1 className="sf-display-lg mt-2">Track your order</h1>
            <p className="sf-muted-fg mt-2 max-w-xl text-sm">
              Enter the order number from your confirmation email and the email used at checkout.
            </p>
          </div>
          <AccountNav base={base} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-14">
          <form onSubmit={handleSubmit} className="sf-editorial-card h-fit space-y-5 p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sf-muted)]">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Look up order</p>
                <p className="sf-muted-fg text-xs">No account required</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order number</Label>
              <Input
                id="orderNumber"
                required
                className="sf-input"
                placeholder="ORD-..."
                value={form.orderNumber}
                onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="sf-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Button type="submit" className="sf-btn-primary h-11 w-full rounded-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track order"}
            </Button>
            <p className="sf-muted-fg text-center text-xs">
              Have an account?{" "}
              <Link href={`${base}/account/login`} className="sf-link underline-offset-4 hover:underline">
                Log in
              </Link>{" "}
              to see all orders.
            </p>
          </form>

          <div>
            {order ? (
              <OrderDetailView store={store} order={order} base={base} showBackLink={false} />
            ) : (
              <div className="sf-editorial-card flex min-h-[320px] flex-col items-center justify-center border-dashed p-10 text-center">
                <Search className="sf-muted-fg mb-4 h-10 w-10" strokeWidth={1.25} />
                <p className="sf-font-display text-xl">Enter your details</p>
                <p className="sf-muted-fg mt-2 max-w-sm text-sm">
                  Your order timeline, items, and shipping summary will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
