"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Phone, Plus, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        <h1 className="text-xl font-semibold leading-snug sf-fg sm:text-2xl">{product.name}</h1>
        {product.sku && (
          <p className="sf-muted-fg mt-1 text-sm">SKU: {product.sku}</p>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-2xl font-bold sf-fg">{formatPrice(price, store.currency)}</span>
        {compareAt && (
          <span className="sf-muted-fg text-lg line-through">
            {formatPrice(compareAt, store.currency)}
          </span>
        )}
      </div>

      <div className="sf-border inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm">
        <Star className="sf-star-filled h-4 w-4" />
        <span className="font-medium">{reviewCount}</span>
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
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  size === s
                    ? "sf-btn-primary border-transparent"
                    : "sf-border sf-surface sf-surface-fg hover:opacity-90",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="sf-muted-fg mt-2 text-sm">
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="sf-border flex items-center rounded border">
          <button
            type="button"
            className="px-3 py-2 hover:opacity-70"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center font-medium">{qty}</span>
          <button
            type="button"
            className="px-3 py-2 hover:opacity-70"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="sf-surface sf-surface-fg min-w-[140px] flex-1 rounded-md"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add To Cart
          </Button>
          <Button
            type="button"
            className="sf-btn-primary min-w-[140px] flex-1 rounded-md"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {phone && theme.header.showPhone && (
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="sf-primary flex flex-col items-center gap-2 rounded px-4 py-4 text-center transition-opacity hover:opacity-95"
        >
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span className="rounded bg-[color-mix(in_srgb,var(--sf-primary-fg)_20%,transparent)] px-3 py-1 text-sm font-medium">
              {phone}
            </span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest">Call Us Now</span>
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
          <Share2 className="sf-muted-fg h-4 w-4" />
          <span className="sf-muted-fg text-sm">Share To:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-border flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold hover:opacity-80"
            aria-label="Share on Facebook"
          >
            f
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sf-border flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold hover:opacity-80"
            aria-label="Share on WhatsApp"
          >
            W
          </a>
        </div>
      </div>

      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to save items</DialogTitle>
            <DialogDescription>
              Create an account or log in to add products to your wishlist.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link href={`/store/${store.slug}/account/login`}>Log in</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/store/${store.slug}/account/register`}>Register</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}