"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Phone, Plus, Star } from "lucide-react";
import { toast } from "sonner";
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

  const phone = theme.contact.phone?.trim();

  return (
    <div className="sf-t2-purchase-panel">
      <p className="sf-t2-label">{store.brandName}</p>
      <h1 className="sf-t2-product-page-title mt-2">{product.name}</h1>
      {product.sku && <p className="sf-t2-section-sub mt-2">SKU {product.sku}</p>}

      <div className="sf-t2-price-row mt-6 text-xl">
        <span>{formatPrice(price, store.currency)}</span>
        {compareAt && <span className="sf-t2-compare">{formatPrice(compareAt, store.currency)}</span>}
      </div>

      {reviewCount > 0 && (
        <div className="sf-t2-rating-row mt-4 flex items-center gap-2 text-sm">
          <Star className="sf-star-filled h-4 w-4" />
          <span>{avgRating.toFixed(1)}</span>
          <span className="sf-t2-section-sub">({reviewCount} reviews)</span>
        </div>
      )}

      {product.colors.length > 0 && (
        <div className="mt-8">
          <p className="sf-t2-label mb-3">Color — {color}</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const swatch = colorImages[c] ?? product.images[0];
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => onColorChange(c)}
                  className={cn("sf-t2-swatch", color === c && "sf-t2-swatch-active")}
                >
                  {swatch ? (
                    <Image src={swatch} alt={c} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-[10px]">{c}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="sf-t2-label mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn("sf-t2-chip", size === s && "sf-t2-chip-active")}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="sf-t2-section-sub mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4">
        <div className="sf-t2-qty flex items-center">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="sf-t2-qty-btn">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="sf-t2-qty-value">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            className="sf-t2-qty-btn"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button type="button" className="sf-t2-btn-ghost w-full" onClick={handleAddToCart} disabled={product.stock <= 0}>
          Add to bag
        </button>
        <button type="button" className="sf-t2-btn-primary w-full" onClick={handleBuyNow} disabled={product.stock <= 0}>
          Buy now
        </button>
      </div>

      {phone && theme.header.showPhone && (
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="sf-t2-phone-row mt-6 flex items-center gap-3">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </a>
      )}

      <button
        type="button"
        onClick={toggleWishlist}
        disabled={wishlistLoading}
        className="sf-t2-wishlist-btn mt-6 flex items-center gap-2"
      >
        <Heart className={cn("h-4 w-4", inWishlist && "sf-destructive-fill")} />
        {inWishlist ? "Saved to wishlist" : "Save to wishlist"}
      </button>

      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <StorefrontDialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Sign in to save items</DialogTitle>
            <DialogDescription>Create an account or log in to use your wishlist.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Link href={`/store/${store.slug}/account/login`} className="sf-t2-btn-primary flex-1 text-center">
              Log in
            </Link>
            <Link href={`/store/${store.slug}/account/register`} className="sf-t2-btn-ghost flex-1 text-center">
              Register
            </Link>
          </div>
        </StorefrontDialogContent>
      </Dialog>
    </div>
  );
}
