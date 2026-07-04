"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore, CartLineItem } from "@/stores/cart.store";
import { useCartHydrated } from "./useCartHydrated";

/** Stable empty reference — never use `[]` inline in Zustand selectors. */
const EMPTY_CART: CartLineItem[] = [];

export function useStoreCartItems(storeId: string) {
  const hydrated = useCartHydrated();
  const allItems = useCartStore(useShallow((s) => s.items));

  return useMemo(() => {
    if (!hydrated) return EMPTY_CART;
    const filtered = allItems.filter((i) => i.storeId === storeId);
    return filtered.length > 0 ? filtered : EMPTY_CART;
  }, [hydrated, allItems, storeId]);
}

export function useStoreCartTotal(storeId: string) {
  const items = useStoreCartItems(storeId);
  return useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
}

export function useStoreCartCount(storeId: string) {
  const items = useStoreCartItems(storeId);
  return useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
}
