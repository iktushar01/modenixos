"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Phone, Plus, Share2, Star, Facebook } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  StorefrontDialogContent,
} from "@/components/modules/storefront/StorefrontDialog";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { useCartStore } from "@/stores/cart.store";
import { cn } from "@/lib/utils";
import {
  addToWishlistAction,
  checkWishlistAction,
  removeFromWishlistAction,
} from "@/actions/storefront-customer.actions";

interface ProductPurchasePanelProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  reviews: Review[];
  isLoggedIn: boolean;
  initialInWishlist?: boolean;
  color: string;
  onColorChange: (color: string) => void;
}

export function ProductPurchasePanel({
  store,
  product,
  theme,
  reviews,
  isLoggedIn,
  initialInWishlist = false,
  color,
  onColorChange,
}: ProductPurchasePanelProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  const { price, compareAt } = productDisplayPrice(product);
  const colorImages = product.details?.colorImages ?? {};

  const { avgRating, reviewCount } = useMemo(() => {
    const count = reviews.length;
    if (count === 0) return { avgRating: 0, reviewCount: 0 };
    const sum = reviews.reduce((n, r) => n + r.rating, 0);
    return { avgRating: sum / count, reviewCount: count };
  }, [reviews]);

  const buildCartItem = () => ({
    storeId: store.id,
    storeSlug: store.slug,
    productId: product.id,
    name: product.name,
    price,
    quantity: qty,
    size,
    color,
    image: colorImages[color] ?? product.images[0],
  });

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem(buildCartItem());
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem(buildCartItem());
    router.push(`/store/${store.slug}/checkout`);
  };

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      setLoginPrompt(true);
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlistAction(store.slug, product.id);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistAction(store.slug, product.id);
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Wishlist update failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/store/${store.slug}/products/${product.id}`;

  const phone = theme.contact.phone?.trim();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="sf-display-lg text-2xl sm:text-3xl">{product.name}</h1>
        {product.sku && (
          <p className="sf-eyebrow mt-2">SKU {product.sku}</p>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="sf-tabular-nums sf-display-lg text-2xl">{formatPrice(price, store.currency)}</span>
        {compareAt && (
          <span className="sf-muted-fg text-lg line-through">
            {formatPrice(compareAt, store.currency)}
          </span>
        )}
      </div>

      <div className="sf-border inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm sf-fg">
        <Star className="sf-star-filled h-4 w-4 shrink-0" />
        <span className="font-medium sf-accent-text">{reviewCount}</span>
        <span className="sf-muted-fg">|</span>
        <span className="sf-muted-fg">{reviewCount} Reviews</span>
        {avgRating > 0 && (
          <span className="sf-muted-fg">({avgRating.toFixed(1)})</span>
        )}
      </div>

      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide sf-fg">
            Color: <span className="font-normal">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const swatch = colorImages[c] ?? product.images[0];
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => onColorChange(c)}
                  className={cn(
                    "relative h-12 w-12 overflow-hidden rounded border-2 transition-colors",
                    color === c
                      ? "border-[var(--sf-primary)]"
                      : "sf-border border-transparent",
                  )}
                >
                  {swatch ? (
                    <Image src={swatch} alt={c} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px]">{c}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide sf-fg">Size:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const isActive = size === s;
              return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "sf-filter-pill-active" : "sf-filter-pill",
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--sf-primary)",
                        color: "var(--sf-primary-fg)",
                        borderColor: "var(--sf-primary)",
                      }
                    : {
                        backgroundColor: "var(--sf-surface)",
                        color: "var(--sf-fg)",
                        borderColor: "var(--sf-border)",
                      }
                }
              >
                {s}
              </button>
            );
            })}
          </div>
          <p className="sf-muted-fg mt-2 text-sm">
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="sf-border sf-surface flex items-center rounded border">
          <button
            type="button"
            className="sf-fg px-3 py-2 hover:opacity-70"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="sf-fg min-w-[2rem] text-center font-medium">{qty}</span>
          <button
            type="button"
            className="sf-fg px-3 py-2 hover:opacity-70"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="sf-btn-outline h-11 min-w-[140px] flex-1 rounded-md"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add To Cart
          </Button>
          <button
            type="button"
            className="sf-btn-primary inline-flex h-11 min-w-[140px] flex-1 items-center justify-center rounded-md text-sm font-medium transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            style={{
              backgroundColor: "var(--sf-primary)",
              color: "var(--sf-primary-fg)",
              borderColor: "var(--sf-primary)",
            }}
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            Buy Now
          </button>
        </div>
      </div>

      {phone && theme.header.showPhone && (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="sf-border group flex w-full items-center gap-4 rounded-md border px-4 py-3.5 transition-colors hover:border-[color-mix(in_srgb,var(--sf-primary)_55%,var(--sf-border))] hover:bg-[color-mix(in_srgb,var(--sf-primary)_6%,var(--sf-surface))]"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-[color-mix(in_srgb,var(--sf-primary)_14%,transparent)]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--sf-primary) 10%, transparent)",
              color: "var(--sf-primary)",
            }}
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="sf-eyebrow block text-[0.625rem]">Call us now</span>
            <span className="mt-0.5 block text-base font-medium tracking-wide sf-fg">{phone}</span>
          </span>
        </a>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4 sf-border">
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide sf-fg transition-opacity hover:opacity-70"
        >
          <Heart
            className={cn("h-5 w-5", inWishlist && "sf-destructive-fill")}
          />
          {inWishlist ? "In Wishlist" : "Add To Wishlist"}
        </button>

        <div className="flex items-center gap-2">
          <Share2 className="sf-muted-fg h-4 w-4" strokeWidth={1.25} />
          <span className="sf-eyebrow">Share</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-btn-outline flex h-9 w-9 items-center justify-center rounded-full border transition-opacity hover:opacity-80"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" strokeWidth={1.25} />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-btn-outline flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold transition-opacity hover:opacity-80"
            aria-label="Share on WhatsApp"
          >
            WA
          </a>
        </div>
      </div>

      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <StorefrontDialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to save items</DialogTitle>
            <DialogDescription>
              Create an account or log in to add products to your wishlist.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button asChild className="sf-btn-primary flex-1">
              <Link href={`/store/${store.slug}/account/login`}>Log in</Link>
            </Button>
            <Button asChild variant="outline" className="sf-btn-outline flex-1">
              <Link href={`/store/${store.slug}/account/register`}>Register</Link>
            </Button>
          </div>
        </StorefrontDialogContent>
      </Dialog>
    </div>
  );
}