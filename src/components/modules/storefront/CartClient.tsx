"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartItems, useStoreCartTotal } from "@/hooks/useStoreCart";
import { formatPrice } from "@/lib/storefrontTheme";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontPageShell } from "./StorefrontPageShell";

export default function CartClient({ store, categories = [] }: { store: Store; categories?: Category[] }) {
  const hydrated = useCartHydrated();
  const items = useStoreCartItems(store.id);
  const total = useStoreCartTotal(store.id);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const [productStocks, setProductStocks] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    const ids = Array.from(new Set(items.map((i) => i.productId)));
    if (ids.length === 0) {
      setProductStocks({});
      return;
    }

    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(`${base}/public/stores/${store.slug}/products/${id}`);
              if (!res.ok) return [id, null] as const;
              const json = await res.json();
              return [id, Number(json?.data?.stock ?? null)] as const;
            } catch {
              return [id, null] as const;
            }
          }),
        );
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const [id, stock] of results) {
          if (stock != null) map[id] = stock;
        }
        setProductStocks(map);
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items, store.slug]);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const base = `/store/${store.slug}`;

  if (!hydrated) {
    return (
      <StorefrontPageShell store={store} categories={categories}>
        <main className="sf-section w-full animate-pulse py-14">
          <div className="sf-skeleton mb-10 h-12 w-56 rounded" />
          <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,380px)] lg:gap-12">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="sf-skeleton h-36 rounded-none" />
              ))}
            </div>
            <div className="sf-skeleton h-72 rounded-none" />
          </div>
        </main>
      </StorefrontPageShell>
    );
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <StorefrontNavLink
            href={base}
            className="sf-eyebrow sf-link mb-10 inline-flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue shopping
          </StorefrontNavLink>

          <div className="mb-8 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="sf-eyebrow">Your bag</p>
              <h1 className="sf-display-lg mt-2">Shopping cart</h1>
            </div>
            {items.length > 0 && (
              <p className="sf-eyebrow">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sf-editorial-card flex flex-col items-center justify-center border-dashed py-28 text-center"
          >
            <div className="sf-muted mb-8 flex h-20 w-20 items-center justify-center rounded-full">
              <ShoppingBag className="h-9 w-9 sf-muted-fg" strokeWidth={1.25} />
            </div>
            <h2 className="sf-display-lg text-2xl">Your cart is empty</h2>
            <p className="sf-muted-fg mt-3 max-w-sm text-sm">
              Discover the latest from {store.brandName}.
            </p>
            <Button asChild className="sf-btn-primary mt-10 h-12 rounded-full px-10">
              <StorefrontNavLink href={storeShopPath(store.slug)}>Browse collection</StorefrontNavLink>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,380px)] lg:gap-12">
            <div className="space-y-5">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="sf-editorial-card flex gap-5 p-5 md:gap-6 md:p-6"
                >
                  <StorefrontNavLink
                    href={`${base}/products/${item.productId}`}
                    className="sf-muted relative h-28 w-24 shrink-0 overflow-hidden md:h-32 md:w-28"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 sf-muted-fg" />
                      </div>
                    )}
                  </StorefrontNavLink>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <StorefrontNavLink href={`${base}/products/${item.productId}`} className="sf-font-display text-lg hover:opacity-70">
                        {item.name}
                      </StorefrontNavLink>
                      {(item.size || item.color) && (
                        <p className="sf-eyebrow mt-2">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="sf-tabular-nums mt-2 text-sm font-medium md:hidden">
                        {formatPrice(item.price * item.quantity, store.currency)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="sf-border inline-flex items-center rounded-full border px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() =>
                            updateQuantity(item.productId, store.id, item.quantity - 1, item.size, item.color)
                          }
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="sf-tabular-nums w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => {
                            const stock = productStocks[item.productId];
                            if (typeof stock === "number" && item.quantity + 1 > stock) {
                              toast.error("Not enough stock");
                              return;
                            }
                            updateQuantity(item.productId, store.id, item.quantity + 1, item.size, item.color);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <p className="sf-tabular-nums hidden min-w-[5rem] text-right text-sm font-medium sm:block">
                        {formatPrice(item.price * item.quantity, store.currency)}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="sf-hover-destructive h-9 w-9 sf-muted-fg"
                        onClick={() => removeItem(item.productId, store.id, item.size, item.color)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.25} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="sf-editorial-card h-fit p-8 lg:sticky lg:top-28"
            >
              <h2 className="sf-display-lg text-xl">Order summary</h2>
              <p className="sf-muted-fg mt-2 text-xs">Free returns · Secure checkout</p>
              <div className="mt-8 space-y-3 text-sm">
                <div className="flex justify-between sf-muted-fg">
                  <span>Subtotal</span>
                  <span className="sf-tabular-nums">{formatPrice(total, store.currency)}</span>
                </div>
                <div className="flex justify-between sf-muted-fg">
                  <span>Shipping</span>
                  <span>At checkout</span>
                </div>
              </div>
              <div className="sf-border mt-6 flex justify-between border-t pt-5">
                <span className="sf-eyebrow sf-fg">Estimated total</span>
                <span className="sf-tabular-nums sf-display-lg text-xl">{formatPrice(total, store.currency)}</span>
              </div>
              <Button asChild className="sf-btn-primary mt-8 h-12 w-full rounded-full">
                <StorefrontNavLink href={`${base}/checkout`}>Proceed to checkout</StorefrontNavLink>
              </Button>
            </motion.aside>
          </div>
        )}
      </main>
    </StorefrontPageShell>
  );
}
