"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
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
import { useOptionalStorefrontCustomer } from "./StorefrontCustomerContext";
import { cn } from "@/lib/utils";

const STEPS = ["Cart", "Details", "Confirm"];

export default function CheckoutClient({
  store,
  categories = [],
}: {
  store: Store;
  categories?: Category[];
}) {
  const router = useRouter();
  const customerCtx = useOptionalStorefrontCustomer();
  const hydrated = useCartHydrated();
  const items = useStoreCartItems(store.id);
  const total = useStoreCartTotal(store.id);
  const clearStore = useCartStore((s) => s.clearStore);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
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

  useEffect(() => {
    const customer = customerCtx?.customer;
    if (!customer) return;
    setForm((prev) => ({
      ...prev,
      customerName: prev.customerName || customer.name,
      customerEmail: prev.customerEmail || customer.email,
      customerPhone: prev.customerPhone || customer.phone || "",
    }));
  }, [customerCtx?.customer]);

  const shipping = 5;
  const finalTotal = total + shipping - discount;
  const base = `/store/${store.slug}`;

  const applyCoupon = async () => {
    try {
      const result = await validateCouponAction(store.slug, coupon, total);
      setDiscount(result.discount);
      setCouponApplied(true);
      toast.success("Coupon applied");
    } catch {
      toast.error("Invalid coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrderAction(store.slug, {
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
      router.push(
        `${base}/orders/confirmation?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(form.customerEmail)}`,
      );
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
          <div className="sf-skeleton mb-8 h-10 w-64 rounded" />
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="sf-skeleton h-96 rounded-none" />
            <div className="sf-skeleton h-64 rounded-none" />
          </div>
        </main>
      </StorefrontPageShell>
    );
  }

  if (items.length === 0) {
    return (
      <StorefrontPageShell store={store} categories={categories}>
        <main className="sf-section w-full py-20 text-center">
          <p className="sf-muted-fg">Your cart is empty.</p>
          <Button asChild className="sf-btn-primary mt-6 rounded-full">
            <Link href={base}>Continue shopping</Link>
          </Button>
        </main>
      </StorefrontPageShell>
    );
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-12 flex items-center justify-center gap-4 md:gap-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 md:gap-4">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                  i <= 1 ? "sf-primary border-transparent" : "sf-border sf-muted-fg",
                )}
              >
                {i < 1 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("sf-eyebrow hidden sm:inline", i === 1 && "sf-fg")}>{step}</span>
              {i < STEPS.length - 1 && <div className="hidden h-px w-8 sf-border bg-border md:block" />}
            </div>
          ))}
        </div>

        <h1 className="sf-display-lg mb-10">Checkout</h1>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section>
              <h2 className="sf-eyebrow mb-6">Contact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Name</Label>
                  <Input id="customerName" required className="sf-input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input id="customerEmail" type="email" required className="sf-input" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input id="customerPhone" className="sf-input" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
              </div>
            </section>

            <section>
              <h2 className="sf-eyebrow mb-6">Shipping</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input id="line1" required className="sf-input" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="sf-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input id="postalCode" required className="sf-input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="sf-eyebrow mb-6">Payment</h2>
              <div className="sf-editorial-card inline-flex items-center gap-3 px-5 py-3">
                <span className="sf-eyebrow">Cash on delivery</span>
              </div>
            </section>

            <Button type="submit" className="sf-btn-primary h-12 w-full rounded-full sm:w-auto sm:px-12" disabled={loading}>
              {loading ? "Placing order…" : "Place order"}
            </Button>
          </form>

          <aside className="sf-editorial-card h-fit p-8 lg:sticky lg:top-28">
            <h2 className="sf-display-lg text-xl">Order summary</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex justify-between gap-4 sf-muted-fg">
                  <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                  <span className="sf-tabular-nums shrink-0">{formatPrice(item.price * item.quantity, store.currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              <Input
                placeholder="Coupon code"
                className={cn("sf-input flex-1", couponApplied && "border-[var(--sf-success)]")}
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
              />
              <Button type="button" variant="outline" className="sf-btn-outline shrink-0" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between sf-muted-fg">
                <span>Subtotal</span>
                <span className="sf-tabular-nums">{formatPrice(total, store.currency)}</span>
              </div>
              <div className="flex justify-between sf-muted-fg">
                <span>Shipping</span>
                <span className="sf-tabular-nums">{formatPrice(shipping, store.currency)}</span>
              </div>
              {discount > 0 && (
                <div className="sf-success-text flex justify-between">
                  <span>Discount</span>
                  <span className="sf-tabular-nums">−{formatPrice(discount, store.currency)}</span>
                </div>
              )}
            </div>
            <div className="sf-border mt-6 flex justify-between border-t pt-5 font-medium">
              <span>Total</span>
              <span className="sf-tabular-nums sf-display-lg text-xl">{formatPrice(finalTotal, store.currency)}</span>
            </div>
          </aside>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
