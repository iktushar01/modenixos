"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  StorefrontDialogContent,
} from "../../../StorefrontDialog";
import { cn } from "@/lib/utils";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface QuickViewModalProps {
  product: Product | null;
  store: Store;
  theme: StorefrontThemeConfig;
  onClose: () => void;
}

export function QuickViewModal({ product, store, onClose }: QuickViewModalProps) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const { price } = productDisplayPrice(product);
  const activeSize = size || product.sizes[0] || "";
  const activeColor = color || product.colors[0] || "";

  const handleAdd = () => {
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem({
      storeId: store.id,
      storeSlug: store.slug,
      productId: product.id,
      name: product.name,
      price,
      quantity: qty,
      size: activeSize || undefined,
      color: activeColor || undefined,
      image: product.images[imageIndex] ?? product.images[0],
    });
    toast.success("Added to cart");
    onClose();
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <StorefrontDialogContent className="sf-t2-quickview flex max-h-[90dvh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-none border p-0 sm:max-w-3xl">
        <div className="grid min-h-0 flex-1 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[240px] sf-muted md:min-h-[420px]">
            {product.images[imageIndex] && (
              <Image src={product.images[imageIndex]} alt={product.name} fill className="object-cover" unoptimized />
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex gap-0 border-t sf-border bg-[color-mix(in_srgb,var(--sf-bg)_90%,transparent)]">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "relative h-16 flex-1 overflow-hidden border-r sf-border last:border-r-0",
                      i === imageIndex ? "opacity-100" : "opacity-40",
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 md:p-8">
            <DialogHeader className="text-left">
              <p className="sf-t2-label">{store.brandName}</p>
              <DialogTitle className="sf-t2-section-title mt-2 text-left text-2xl">{product.name}</DialogTitle>
            </DialogHeader>

            <p className="sf-t2-price-row mt-4 text-lg">{formatPrice(price, store.currency)}</p>

            {product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="sf-t2-label mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn("sf-t2-chip", activeSize === s && "sf-t2-chip-active")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="sf-t2-label mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn("sf-t2-chip", activeColor === c && "sf-t2-chip-active")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <span className="sf-t2-label">Qty</span>
              <div className="sf-t2-qty flex items-center">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="sf-t2-qty-btn">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="sf-t2-qty-value">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="sf-t2-qty-btn">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-8">
              <button type="button" className="sf-t2-btn-primary w-full" onClick={handleAdd}>
                Add to bag
              </button>
              <Link
                href={`/store/${store.slug}/products/${product.id}`}
                className="sf-t2-link-underline text-center"
                onClick={onClose}
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </StorefrontDialogContent>
    </Dialog>
  );
}
