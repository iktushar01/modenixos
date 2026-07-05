"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Category, Store, WishlistItem } from "@/types/store.types";
import { formatPrice, productDisplayPrice } from "@/lib/storefrontTheme";
import { removeFromWishlistAction } from "@/actions/storefront-customer.actions";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
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
      <main className="sf-section w-full py-10 md:py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sf-fg">My Wishlist</h1>
            <p className="sf-muted-fg text-sm">{list.length} saved items</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={base}>Continue shopping</Link>
          </Button>
        </div>

        {list.length === 0 ? (
          <div className="sf-muted flex flex-col items-center justify-center rounded-2xl border py-20 text-center sf-border">
            <Heart className="sf-muted-fg mb-4 h-12 w-12" />
            <p className="sf-fg font-medium">Your wishlist is empty</p>
            <p className="sf-muted-fg mt-1 text-sm">Save products you love while browsing.</p>
            <Button asChild className="sf-btn-primary mt-6">
              <Link href={base}>Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((item) => {
              const { price, compareAt } = productDisplayPrice(item.product);
              return (
                <article key={item.id} className="sf-card sf-border overflow-hidden rounded-xl border">
                  <Link
                    href={`${base}/products/${item.product.id}`}
                    className="relative block aspect-[3/4] sf-muted"
                  >
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : null}
                  </Link>
                  <div className="space-y-2 p-4">
                    <Link href={`${base}/products/${item.product.id}`}>
                      <h3 className="line-clamp-2 text-sm font-medium sf-fg hover:opacity-80">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold sf-fg">
                        {formatPrice(price, store.currency)}
                      </span>
                      {compareAt && (
                        <span className="sf-muted-fg line-through text-xs">
                          {formatPrice(compareAt, store.currency)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={removingId === item.productId}
                      onClick={() => handleRemove(item.productId)}
                    >
                      {removingId === item.productId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Remove
                        </>
                      )}
                    </Button>
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
