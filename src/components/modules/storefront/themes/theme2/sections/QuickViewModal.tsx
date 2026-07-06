"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
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

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0] ?? "");
    setQty(1);
    setImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const { price, compareAt } = productDisplayPrice(product);
  const colorImages = product.details?.colorImages ?? {};
  const activeSize = size || product.sizes[0] || "";
  const activeColor = color || product.colors[0] || "";
  const previewImage =
    (activeColor && colorImages[activeColor]) || product.images[imageIndex] || product.images[0];

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
      image: previewImage,
    });
    toast.success("Added to cart");
    onClose();
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <StorefrontDialogContent
        data-storefront-theme="theme2"
        showCloseButton={false}
        className="sf-t2-quickview flex max-h-[min(90dvh,720px)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-none border p-0 sm:max-w-4xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="sf-t2-quickview-close absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center border sf-border bg-[color-mix(in_srgb,var(--sf-bg)_92%,transparent)]"
          aria-label="Close quick view"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid min-h-0 flex-1 md:grid-cols-2">
          <div className="relative min-h-[220px] bg-[var(--sf-muted)] sm:min-h-[280px] md:min-h-full">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={product.name}
                fill
                className="object-contain p-4 md:object-cover md:p-0"
                unoptimized
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center text-sm sf-muted-fg">
                No image
              </div>
            )}

            {product.images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex gap-0 overflow-x-auto border-t sf-border bg-[color-mix(in_srgb,var(--sf-bg)_94%,transparent)]">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden border-r sf-border last:border-r-0",
                      i === imageIndex ? "opacity-100 ring-2 ring-inset ring-[var(--sf-primary)]" : "opacity-50 hover:opacity-80",
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-col overflow-y-auto border-t sf-border p-5 sm:p-6 md:border-l md:border-t-0 md:p-8">
            <DialogHeader className="space-y-0 text-left">
              <p className="sf-t2-label">{store.brandName}</p>
              <DialogTitle className="sf-t2-quickview-title mt-2 text-left">{product.name}</DialogTitle>
            </DialogHeader>

            <div className="sf-t2-price-row mt-4 text-lg">
              <span>{formatPrice(price, store.currency)}</span>
              {compareAt && <span className="sf-t2-compare">{formatPrice(compareAt, store.currency)}</span>}
            </div>

            {product.description && (
              <p className="sf-t2-section-sub mt-3 line-clamp-3">{product.description}</p>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="sf-t2-label mb-3">
                  Size <span className="normal-case tracking-normal text-[var(--sf-fg)]">— {activeSize}</span>
                </p>
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
              <div className="mt-5">
                <p className="sf-t2-label mb-3">
                  Color <span className="normal-case tracking-normal text-[var(--sf-fg)]">— {activeColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const swatch = colorImages[c];
                    return (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          swatch ? "sf-t2-swatch" : "sf-t2-chip",
                          activeColor === c && (swatch ? "sf-t2-swatch-active" : "sf-t2-chip-active"),
                        )}
                      >
                        {swatch ? (
                          <Image src={swatch} alt={c} fill className="object-cover" unoptimized />
                        ) : (
                          c
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="sf-t2-label mb-3">Quantity</p>
              <div className="sf-t2-qty inline-flex items-center">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="sf-t2-qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="sf-t2-qty-value">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="sf-t2-qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="sf-t2-section-sub mt-2">
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-8">
              <button
                type="button"
                className="sf-t2-btn-primary w-full"
                onClick={handleAdd}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of stock" : "Add to bag"}
              </button>
              <Link
                href={`/store/${store.slug}/products/${product.id}`}
                className="sf-t2-btn-ghost w-full text-center"
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
