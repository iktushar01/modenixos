"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderItem } from "@/types/store.types";

interface CartItem extends OrderItem {
  storeId: string;
  storeSlug: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, storeId: string) => void;
  updateQuantity: (productId: string, storeId: string, quantity: number) => void;
  clearStore: (storeId: string) => void;
  getStoreItems: (storeId: string) => CartItem[];
  getStoreTotal: (storeId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.storeId === item.storeId && i.size === item.size && i.color === item.color,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.storeId === item.storeId && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId, storeId) => {
        set({ items: get().items.filter((i) => !(i.productId === productId && i.storeId === storeId)) });
      },
      updateQuantity: (productId, storeId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.storeId === storeId ? { ...i, quantity } : i,
          ),
        });
      },
      clearStore: (storeId) => {
        set({ items: get().items.filter((i) => i.storeId !== storeId) });
      },
      getStoreItems: (storeId) => get().items.filter((i) => i.storeId === storeId),
      getStoreTotal: (storeId) =>
        get().items.filter((i) => i.storeId === storeId).reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "modenixos-cart" },
  ),
);
