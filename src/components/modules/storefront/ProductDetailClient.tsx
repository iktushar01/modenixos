"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Product, Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { StorefrontHeader } from "./StorefrontHeader";

export default function ProductDetailClient({ store, product }: { store: Store; product: Product }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const price = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    addItem({
      storeId: store.id,
      storeSlug: store.slug,
      productId: product.id,
      name: product.name,
      price,
      quantity: qty,
      size,
      color,
      image: product.images[0],
    });
    toast.success("Added to cart");
  };

  return (
    <div>
      <StorefrontHeader store={store} />
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold">${price.toFixed(2)}</p>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          {product.sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <Button key={s} variant={size === s ? "default" : "outline"} size="sm" onClick={() => setSize(s)}>{s}</Button>
                ))}
              </div>
            </div>
          )}
          {product.colors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Color</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <Button key={c} variant={color === c ? "default" : "outline"} size="sm" onClick={() => setColor(c)}>{c}</Button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="outline" asChild><Link href={`/store/${store.slug}/cart`}>View Cart</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
