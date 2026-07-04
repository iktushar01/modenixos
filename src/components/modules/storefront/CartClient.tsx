"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Store } from "@/types/store.types";
import { useCartStore } from "@/stores/cart.store";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice, parseStorefrontTheme } from "@/lib/storefrontTheme";
import { StoreNavbar } from "./StoreNavbar";
import { StoreFooter } from "./StoreFooter";

export default function CartClient({ store }: { store: Store }) {
  const hydrated = useHydrated();
  const theme = parseStorefrontTheme(store);
  const items = useCartStore((s) => (hydrated ? s.getStoreItems(store.id) : []));
  const total = useCartStore((s) => (hydrated ? s.getStoreTotal(store.id) : 0));
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const base = `/store/${store.slug}`;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <StoreNavbar store={store} theme={theme} />
        <main className="mx-auto max-w-7xl animate-pulse px-4 py-14 md:px-6">
          <div className="mb-10 h-10 w-48 rounded bg-white/10" />
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-white/5" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={
        {
          "--store-primary": theme.primaryColor,
          "--store-secondary": theme.secondaryColor,
        } as React.CSSProperties
      }
    >
      <StoreNavbar store={store} theme={theme} />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={base}
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Your bag</p>
              <h1 className="mt-2 text-3xl font-light md:text-4xl">Shopping Cart</h1>
            </div>
            {items.length > 0 && (
              <p className="text-sm text-white/50">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-24 text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <ShoppingBag className="h-8 w-8 text-white/30" />
            </div>
            <h2 className="text-xl font-medium text-white/80">Your cart is empty</h2>
            <p className="mt-2 max-w-sm text-sm text-white/45">
              Discover the latest pieces from {store.brandName} and add something you love.
            </p>
            <Button
              asChild
              className="mt-8 h-11 rounded-full px-8 text-black"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Link href={`${base}#shop`}>Browse products</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:gap-6 md:p-5"
                >
                  <Link
                    href={`${base}/products/${item.productId}`}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900 md:h-28 md:w-24"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-white/20" />
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <Link
                        href={`${base}/products/${item.productId}`}
                        className="font-medium text-white transition-colors hover:text-white/80"
                      >
                        {item.name}
                      </Link>
                      {(item.size || item.color) && (
                        <p className="mt-1 text-sm text-white/45">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-medium text-white/80 md:hidden">
                        {formatPrice(item.price * item.quantity, store.currency)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="inline-flex items-center rounded-full border border-white/15">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-white hover:bg-white/10"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              store.id,
                              item.quantity - 1,
                              item.size,
                              item.color,
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-white hover:bg-white/10"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              store.id,
                              item.quantity + 1,
                              item.size,
                              item.color,
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <p className="hidden min-w-[5rem] text-right text-sm font-medium text-white sm:block">
                        {formatPrice(item.price * item.quantity, store.currency)}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-white/40 hover:bg-white/10 hover:text-red-400"
                        onClick={() => removeItem(item.productId, store.id, item.size, item.color)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
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
              className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24"
            >
              <h2 className="text-lg font-medium">Order summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(total, store.currency)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="text-white/40">Calculated at checkout</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
                <span className="font-medium">Estimated total</span>
                <span className="text-lg font-semibold">{formatPrice(total, store.currency)}</span>
              </div>
              <Button
                asChild
                className="mt-6 h-12 w-full rounded-full text-black"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Link href={`${base}/checkout`}>Proceed to checkout</Link>
              </Button>
              <p className="mt-4 text-center text-xs text-white/35">
                Secure checkout · Cash on delivery available
              </p>
            </motion.aside>
          </div>
        )}
      </main>

      <StoreFooter store={store} theme={theme} />
    </div>
  );
}
