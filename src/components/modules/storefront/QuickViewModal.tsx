"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  StorefrontDialogContent,
} from "./StorefrontDialog";
import { cn } from "@/lib/utils";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface QuickViewModalProps {
  product: Product | null;
  store: Store;
  theme: StorefrontThemeConfig;
  onClose: () => void;
}

export function QuickViewModal({ product, store, theme, onClose }: QuickViewModalProps) {
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
      <StorefrontDialogContent className="flex max-h-[90dvh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="grid min-h-0 flex-1 md:grid-cols-2">
          <div className="relative aspect-square shrink-0 sf-muted md:aspect-auto md:h-full md:min-h-[320px]">
            {product.images[imageIndex] && (
              <Image src={product.images[imageIndex]} alt={product.name} fill className="object-cover" unoptimized />
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "relative h-14 w-12 shrink-0 overflow-hidden border-2",
                      i === imageIndex ? "border-[var(--sf-primary)]" : "sf-border opacity-60",
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-h-0 space-y-5 overflow-y-auto p-6 sm:space-y-6 sm:p-8 md:p-10">
            <DialogHeader className="text-left">
              <p className="sf-eyebrow">{store.brandName}</p>
              <DialogTitle className="sf-display-lg mt-2 text-2xl">{product.name}</DialogTitle>
            </DialogHeader>
            <p className="sf-tabular-nums text-xl font-medium sf-fg">{formatPrice(price, store.currency)}</p>
            {product.description && (
              <p className="sf-muted-fg line-clamp-3 text-sm leading-relaxed">{product.description}</p>
            )}

            {product.sizes.length > 0 && (
              <div>
                <p className="sf-eyebrow mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        activeSize === s ? "sf-filter-pill-active" : "sf-filter-pill",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="sf-eyebrow mb-3">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors",
                        activeColor === c ? "sf-filter-pill-active" : "sf-filter-pill",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="sf-eyebrow mb-3">Quantity</p>
              <div className="sf-border inline-flex items-center rounded-full border px-1">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center sf-tabular-nums sf-fg">{qty}</span>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button className="sf-btn-primary h-12 w-full flex-1 rounded-full sm:min-w-0" onClick={handleAdd} disabled={product.stock <= 0}>
                {product.stock <= 0 ? "Out of stock" : "Add to cart"}
              </Button>
              <Button asChild variant="outline" className="sf-btn-outline h-12 w-full shrink-0 rounded-full px-6 sm:w-auto">
                <Link href={`/store/${store.slug}/products/${product.id}`} onClick={onClose}>
                  View details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </StorefrontDialogContent>
    </Dialog>
  );
}
