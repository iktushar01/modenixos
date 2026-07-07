"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { StorefrontNavLink } from "../../../StorefrontNavLink";
import { formatPrice } from "@/lib/currency";
import { storeProductPath, storeShopPath } from "@/lib/storePaths";

export interface Theme3ProductDetailProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  relatedProducts: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  inWishlist: boolean;
}

export function Theme3ProductDetail({
  store,
  product,
  theme: _theme,
  relatedProducts,
  reviews,
  isLoggedIn: _isLoggedIn,
  inWishlist,
}: Theme3ProductDetailProps) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const displayImages = useMemo(() => (product.images.length ? product.images : []), [product.images]);
  const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;

  return (
    <main className="sf-section w-full py-6 sm:py-8 md:py-12">
      <nav className="mb-5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        <StorefrontNavLink href={storeShopPath(store.slug)} className="hover:underline">Shop</StorefrontNavLink>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border sf-border bg-card">
            {displayImages[activeImage] ? (
              <Image
                src={displayImages[activeImage]}
                alt={product.name}
                width={1200}
                height={1200}
                className="aspect-square w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="grid aspect-square place-items-center text-sm text-muted-foreground">No image</div>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {displayImages.slice(0, 5).map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`overflow-hidden rounded-xl border ${idx === activeImage ? "border-primary" : "border-border"}`}
              >
                <Image src={img} alt={`${product.name}-${idx}`} width={240} height={240} className="aspect-square w-full object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border sf-border bg-card p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Theme 3 Product</p>
          <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(price, store.currency)}</span>
            {price !== product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price, store.currency)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4" fill={i < 4 ? "currentColor" : "none"} />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{reviews.length} reviews</span>
          </div>

          {product.description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>}

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-3 py-1 text-xs ${color === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Quantity</p>
            <div className="mt-2 inline-flex items-center rounded-full border sf-border">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2"><Minus className="h-3 w-3" /></button>
              <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 py-2"><Plus className="h-3 w-3" /></button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button type="button" className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Add to cart
            </button>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full border sf-border px-4 py-2 text-sm font-semibold">
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
              {inWishlist ? "Wishlisted" : "Save to wishlist"}
            </button>
          </div>
        </aside>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border sf-border bg-card p-5">
          <h2 className="text-lg font-semibold">Details</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>SKU: {product.sku || "N/A"}</li>
            <li>Stock: {product.stock}</li>
            <li>Sizes: {product.sizes.length ? product.sizes.join(", ") : "Standard"}</li>
            <li>Tags: {product.tags.length ? product.tags.slice(0, 4).join(", ") : "—"}</li>
          </ul>
        </div>
        <div className="rounded-2xl border sf-border bg-card p-5">
          <h2 className="text-lg font-semibold">Recent Reviews</h2>
          <div className="mt-3 space-y-3">
            {reviews.slice(0, 2).map((review) => (
              <article key={review.id} className="rounded-xl border sf-border p-3">
                <p className="text-xs text-muted-foreground">{review.guestName || "Customer"} • {review.rating}/5</p>
                <p className="mt-1 text-sm">{review.comment}</p>
              </article>
            ))}
            {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Related products</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.slice(0, 4).map((item) => (
            <StorefrontNavLink key={item.id} href={storeProductPath(store.slug, item.id)} className="overflow-hidden rounded-xl border sf-border bg-card">
              <div className="aspect-[4/5] bg-muted/30">
                {item.images[0] ? (
                  <Image src={item.images[0]} alt={item.name} width={500} height={620} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">No image</div>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-sm">{formatPrice(item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price, store.currency)}</p>
              </div>
            </StorefrontNavLink>
          ))}
        </div>
      </section>
    </main>
  );
}
