"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartItems, useStoreCartTotal } from "@/hooks/useStoreCart";
import { formatPrice } from "@/lib/storefrontTheme";
import { placeOrderAction, validateCouponAction } from "@/actions/catalog.actions";
import { StorefrontPageShell } from "./StorefrontPageShell";

export default function CheckoutClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useStoreCartItems(store.id);
  const total = useStoreCartTotal(store.id);
  const clearStore = useCartStore((s) => s.clearStore);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    line1: "",
    city: "",
    postalCode: "",
    country: "US",
  });

  const shipping = 5;
  const finalTotal = total + shipping - discount;
  const base = `/store/${store.slug}`;

  const applyCoupon = async () => {
    try {
      const result = await validateCouponAction(store.slug, coupon, total);
      setDiscount(result.discount);
      toast.success("Coupon applied");
    } catch {
      toast.error("Invalid coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await placeOrderAction(store.slug, {
        items,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        shippingAddress: {
          line1: form.line1,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        subtotal: total,
        shipping,
        discount,
        total: finalTotal,
        couponCode: coupon || undefined,
        paymentMethod: "COD",
      });
      clearStore(store.id);
      toast.success("Order placed successfully!");
      router.push(base);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <StorefrontPageShell store={store} categories={categories}>
        <main className="sf-section w-full animate-pulse py-14">
          <div className="sf-skeleton mx-auto h-10 w-48 rounded" />
          <div className="sf-skeleton mx-auto mt-8 h-96 max-w-2xl rounded-2xl" />
        </main>
      </StorefrontPageShell>
    );
  }

  if (items.length === 0) {
    return (
      <StorefrontPageShell store={store} categories={categories}>
        <main className="sf-section w-full py-16 text-center">
          <p className="sf-muted-fg">Your cart is empty.</p>
          <Button asChild className="sf-btn-primary mt-4">
            <Link href={base}>Continue shopping</Link>
          </Button>
        </main>
      </StorefrontPageShell>
    );
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-3xl font-light">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  required
                  className="sf-input"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  required
                  className="sf-input"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                className="sf-input"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line1">Address</Label>
              <Input
                id="line1"
                required
                className="sf-input"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  className="sf-input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  required
                  className="sf-input"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Coupon code"
                className="sf-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <Button type="button" variant="outline" className="sf-btn-outline" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            <div className="sf-border sf-card space-y-2 rounded-lg border p-4">
              <div className="flex justify-between text-sm">
                <span className="sf-muted-fg">Subtotal</span>
                <span>{formatPrice(total, store.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="sf-muted-fg">Shipping</span>
                <span>{formatPrice(shipping, store.currency)}</span>
              </div>
              {discount > 0 && (
                <div className="sf-success-text flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-{formatPrice(discount, store.currency)}</span>
                </div>
              )}
              <div className="sf-border flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatPrice(finalTotal, store.currency)}</span>
              </div>
              <p className="text-sm sf-muted-fg">Payment: Cash on Delivery</p>
            </div>
            <Button type="submit" className="sf-btn-primary w-full" disabled={loading}>
              {loading ? "Placing order..." : "Place order"}
            </Button>
          </form>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
