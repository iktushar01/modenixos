"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Category, Store, WishlistItem } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { removeFromWishlistAction } from "@/actions/storefront-customer.actions";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { useStorefrontCustomer } from "@/components/modules/storefront/StorefrontCustomerContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WishlistClient({
  store,
  categories = [],
  items,
}: {
  store: Store;
  categories?: Category[];
  items: WishlistItem[];
}) {
  const router = useRouter();
  const { customer, logout } = useStorefrontCustomer();
  const [list, setList] = useState(items);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const base = `/store/${store.slug}`;

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromWishlistAction(store.slug, productId);
      setList((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
      router.refresh();
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="sf-eyebrow">Saved</p>
            <h1 className="sf-display-lg mt-2">My wishlist</h1>
            <p className="sf-muted-fg mt-2 text-sm">
              {customer?.name ? `${customer.name} · ` : ""}
              {list.length} items
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="sf-btn-outline rounded-full"
              onClick={async () => {
                await logout();
                router.push(`${base}/account/login`);
              }}
            >
              Log out
            </Button>
            <Button variant="outline" asChild className="sf-btn-outline rounded-full">
              <Link href={base}>Continue shopping</Link>
            </Button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="sf-editorial-card flex flex-col items-center justify-center border-dashed py-24 text-center">
            <Heart className="sf-muted-fg mb-6 h-12 w-12" strokeWidth={1.25} />
            <p className="sf-display-lg text-xl">Your wishlist is empty</p>
            <p className="sf-muted-fg mt-2 text-sm">Save pieces you love while browsing.</p>
            <Button asChild className="sf-btn-primary mt-8 rounded-full px-8">
              <Link href={base}>Browse collection</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((item) => {
              const { price, compareAt } = productDisplayPrice(item.product);
              return (
                <article key={item.id} className="sf-editorial-card group overflow-hidden">
                  <Link href={`${base}/products/${item.product.id}`} className="sf-image-zoom relative block aspect-[3/4] sf-muted">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" unoptimized />
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sf-card)_90%,transparent)] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                      disabled={removingId === item.productId}
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.productId);
                      }}
                      aria-label="Remove from wishlist"
                    >
                      {removingId === item.productId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="sf-destructive-fill h-4 w-4" />
                      )}
                    </button>
                  </Link>
                  <div className="space-y-2 p-4">
                    <Link href={`${base}/products/${item.product.id}`}>
                      <h3 className="sf-font-display line-clamp-2 text-base hover:opacity-70">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="sf-tabular-nums flex items-center gap-2 text-sm">
                      <span className="font-medium sf-fg">{formatPrice(price, store.currency)}</span>
                      {compareAt && (
                        <span className="sf-muted-fg line-through text-xs">{formatPrice(compareAt, store.currency)}</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </StorefrontPageShell>
  );
}
