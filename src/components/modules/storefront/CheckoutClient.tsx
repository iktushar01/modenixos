"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { placeOrderAction, validateCouponAction } from "@/actions/catalog.actions";
import { StorefrontHeader } from "./StorefrontHeader";

export default function CheckoutClient({ store }: { store: Store }) {
  const router = useRouter();
  const items = useCartStore((s) => s.getStoreItems(store.id));
  const total = useCartStore((s) => s.getStoreTotal(store.id));
  const clearStore = useCartStore((s) => s.clearStore);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", line1: "", city: "", postalCode: "", country: "US" });

  const shipping = 5;
  const finalTotal = total + shipping - discount;

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
        shippingAddress: { line1: form.line1, city: form.city, postalCode: form.postalCode, country: form.country },
        subtotal: total,
        shipping,
        discount,
        total: finalTotal,
        couponCode: coupon || undefined,
        paymentMethod: "COD",
      });
      clearStore(store.id);
      toast.success("Order placed successfully!");
      router.push(`/store/${store.slug}`);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <StorefrontHeader store={store} />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Your cart is empty.</p>
          <Button asChild className="mt-4"><Link href={`/store/${store.slug}`}>Continue Shopping</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StorefrontHeader store={store} />
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" required value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
          </div>
          <div><Label>Address</Label><Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>City</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>Postal Code</Label><Input required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
            <p className="text-sm text-muted-foreground">Payment: Cash on Delivery</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</Button>
        </form>
      </div>
    </div>
  );
}
