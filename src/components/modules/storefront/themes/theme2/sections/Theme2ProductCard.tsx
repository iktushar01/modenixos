"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Product, Store } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { StorefrontNavLink } from "../../StorefrontNavLink";
import { cn } from "@/lib/utils";

interface Theme2ProductCardProps {
  product: Product;
  store: Store;
  rating?: number;
  onQuickView: (product: Product) => void;
  variant?: "grid" | "list" | "bento";
}

function Theme2ProductCardInner({
  product,
  store,
  rating,
  onQuickView,
  variant = "grid",
}: Theme2ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { price, compareAt, discountPercent } = productDisplayPrice(product);
  const productHref = `/store/${store.slug}/products/${product.id}`;

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

  if (variant === "list") {
    return (
      <article className="sf-t2-product-list group border-b sf-border py-6">
        <div className="flex gap-5 sm:gap-8">
          <StorefrontNavLink href={productHref} className="sf-t2-product-thumb relative block w-28 shrink-0 sm:w-36">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="sf-muted absolute inset-0" />
            )}
          </StorefrontNavLink>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <p className="sf-t2-label">{discountPercent ? `−${discountPercent}%` : "New arrival"}</p>
              <StorefrontNavLink href={productHref}>
                <h3 className="sf-t2-product-title mt-1">{product.name}</h3>
              </StorefrontNavLink>
              <div className="sf-t2-price-row mt-2">
                <span>{formatPrice(price, store.currency)}</span>
                {compareAt && <span className="sf-t2-compare">{formatPrice(compareAt, store.currency)}</span>}
                {rating && <span className="sf-t2-rating">{rating.toFixed(1)} ★</span>}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" className="sf-t2-btn-ghost" onClick={() => onQuickView(product)}>
                Quick view
              </button>
              <button type="button" className="sf-t2-btn-primary" onClick={handleAddToCart}>
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "sf-t2-product-card group",
        variant === "bento" && "sf-t2-product-bento",
      )}
    >
      <div className="sf-t2-product-media relative overflow-hidden">
        <StorefrontNavLink href={productHref} className="block">
          <div className={cn("relative overflow-hidden sf-muted", variant === "bento" ? "aspect-[4/5]" : "aspect-square")}>
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
            ) : (
              <div className="sf-muted-fg flex h-full items-center justify-center text-sm">No image</div>
            )}
            {discountPercent && (
              <span className="sf-t2-badge absolute left-0 top-0">Sale {discountPercent}%</span>
            )}
          </div>
        </StorefrontNavLink>
        <div className="sf-t2-product-actions">
          <button type="button" className="sf-t2-btn-primary w-full" onClick={handleAddToCart}>
            Add to bag
          </button>
          <button type="button" className="sf-t2-btn-ghost w-full" onClick={() => onQuickView(product)}>
            Quick view
          </button>
        </div>
      </div>
      <div className="sf-t2-product-meta">
        <StorefrontNavLink href={productHref} className="sf-t2-product-link">
          <h3 className="sf-t2-product-title">{product.name}</h3>
          <ArrowUpRight className="sf-t2-product-arrow h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </StorefrontNavLink>
        <div className="sf-t2-price-row">
          <span>{formatPrice(price, store.currency)}</span>
          {compareAt && <span className="sf-t2-compare">{formatPrice(compareAt, store.currency)}</span>}
          {rating && <span className="sf-t2-rating ml-auto">{rating.toFixed(1)}</span>}
        </div>
      </div>
    </article>
  );
}

export const Theme2ProductCard = memo(Theme2ProductCardInner);
