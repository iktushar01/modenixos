"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface ProductCardProps {
  product: Product;
  store: Store;
  theme: StorefrontThemeConfig;
  rating?: number;
  onQuickView: (product: Product) => void;
  layout?: "grid" | "scroll";
}

export function ProductCard({ product, store, theme, rating, onQuickView, layout = "grid" }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { price, compareAt, discountPercent } = productDisplayPrice(product);
  const secondImage = product.images[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
      image: product.images[0],
    });
    toast.success("Added to cart");
  };

  return (
    <motion.article
      layout={layout === "grid"}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group",
        layout === "scroll" && "w-[min(78vw,260px)] shrink-0 snap-start sm:w-[280px]",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sf-editorial-card sf-image-zoom relative overflow-hidden">
        <Link href={`/store/${store.slug}/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden sf-muted">
            {product.images[0] ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    hovered && secondImage ? "opacity-0" : "opacity-100",
                  )}
                  unoptimized
                />
                {secondImage && (
                  <Image
                    src={secondImage}
                    alt=""
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      hovered ? "opacity-100" : "opacity-0",
                    )}
                    unoptimized
                  />
                )}
              </>
            ) : (
              <div className="sf-muted-fg flex h-full items-center justify-center text-sm">No image</div>
            )}

            {discountPercent && (
              <span className="sf-eyebrow absolute left-4 top-4 sf-badge-secondary rounded-full px-3 py-1">
                −{discountPercent}%
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-[color-mix(in_srgb,var(--sf-card)_92%,transparent)] p-2.5 backdrop-blur-sm transition-transform duration-300 md:translate-y-full md:p-3 md:group-hover:translate-y-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="sf-btn-primary sf-touch-target h-10 flex-1 rounded-full text-xs uppercase tracking-wider"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="sf-btn-outline sf-touch-target h-10 w-10 shrink-0 rounded-full px-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-4 space-y-1.5 px-0.5">
        <p className="sf-eyebrow">{store.brandName}</p>
        <Link href={`/store/${store.slug}/products/${product.id}`}>
          <h3 className="sf-font-display truncate text-base sf-fg transition-opacity hover:opacity-70">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="sf-tabular-nums flex items-center gap-2 text-sm">
            <span className="font-medium sf-fg">{formatPrice(price, store.currency)}</span>
            {compareAt && (
              <span className="sf-muted-fg line-through">{formatPrice(compareAt, store.currency)}</span>
            )}
          </div>
          {rating ? (
            <div className="sf-muted-fg flex items-center gap-1 text-xs">
              <Star className="sf-star-filled h-3 w-3" strokeWidth={1.25} />
              {rating.toFixed(1)}
            </div>
          ) : product.tags?.includes("new") ? (
            <span className="sf-eyebrow">New</span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
