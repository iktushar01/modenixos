"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice, StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="sf-card sf-border relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="sf-fg absolute right-3 top-3 z-10 rounded-full hover:opacity-80"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square sf-muted">
              {product.images[imageIndex] && (
                <Image src={product.images[imageIndex]} alt={product.name} fill className="object-cover" unoptimized />
              )}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={cn(
                        "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2",
                        i === imageIndex ? "border-[var(--sf-primary)]" : "sf-border opacity-60",
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5 p-6 md:p-8">
              <div>
                <h2 className="text-2xl font-light sf-fg">{product.name}</h2>
                <p className="mt-2 text-xl font-medium sf-fg">{formatPrice(price, store.currency)}</p>
              </div>
              {product.description && (
                <p className="sf-muted-fg line-clamp-3 text-sm leading-relaxed">{product.description}</p>
              )}

              {product.sizes.length > 0 && (
                <div>
                  <p className="sf-muted-fg mb-2 text-xs uppercase tracking-wider">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
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
                  <p className="sf-muted-fg mb-2 text-xs uppercase tracking-wider">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
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
                <p className="sf-muted-fg mb-2 text-xs uppercase tracking-wider">Quantity</p>
                <div className="sf-border inline-flex items-center rounded-full border">
                  <Button variant="ghost" size="icon" className="sf-fg rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center sf-fg">{qty}</span>
                  <Button variant="ghost" size="icon" className="sf-fg rounded-full" onClick={() => setQty((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                className="sf-btn-primary h-12 w-full rounded-full"
                onClick={handleAdd}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of stock" : "Add to cart"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
