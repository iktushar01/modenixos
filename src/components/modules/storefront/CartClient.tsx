"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { StorefrontHeader } from "./StorefrontHeader";

export default function CartClient({ store }: { store: Store }) {
  const items = useCartStore((s) => s.getStoreItems(store.id));
  const total = useCartStore((s) => s.getStoreTotal(store.id));
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div>
      <StorefrontHeader store={store} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Cart</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, store.id, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, store.id, item.quantity + 1)}>+</Button>
                  <span className="w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId, store.id)}>Remove</Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4">
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              <Button asChild><Link href={`/store/${store.slug}/checkout`}>Checkout</Link></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
