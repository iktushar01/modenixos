"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice, StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      className={cn("group", layout === "scroll" && "w-[260px] shrink-0 snap-start sm:w-[280px]")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50">
        <Link href={`/store/${store.slug}/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
            {product.images[0] ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500",
                    hovered && secondImage ? "opacity-0" : "opacity-100 group-hover:scale-105",
                  )}
                  unoptimized
                />
                {secondImage && (
                  <Image
                    src={secondImage}
                    alt=""
                    fill
                    className={cn(
                      "object-cover transition-all duration-500",
                      hovered ? "scale-105 opacity-100" : "opacity-0",
                    )}
                    unoptimized
                  />
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-white/20">No image</div>
            )}

            {discountPercent && (
              <span
                className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                -{discountPercent}%
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
              <Button
                size="sm"
                className="flex-1 rounded-full text-xs text-black"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Add
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/90 text-xs text-black hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-3 space-y-1 px-1">
        <Link href={`/store/${store.slug}/products/${product.id}`}>
          <h3 className="truncate text-sm font-medium text-white transition-colors hover:text-white/80">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-white">{formatPrice(price, store.currency)}</span>
            {compareAt && (
              <span className="text-white/40 line-through">{formatPrice(compareAt, store.currency)}</span>
            )}
          </div>
          {rating ? (
            <div className="flex items-center gap-0.5 text-xs text-white/50">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </div>
          ) : product.tags.includes("new") ? (
            <span className="text-[10px] uppercase tracking-wider text-white/40">New</span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
