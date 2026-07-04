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
  removeItem: (productId: string, storeId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, storeId: string, quantity: number, size?: string, color?: string) => void;
  clearStore: (storeId: string) => void;
  getStoreItems: (storeId: string) => CartItem[];
  getStoreTotal: (storeId: string) => number;
}

const matchesLine = (
  item: CartItem,
  productId: string,
  storeId: string,
  size?: string,
  color?: string,
) =>
  item.productId === productId &&
  item.storeId === storeId &&
  item.size === size &&
  item.color === color;

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
      removeItem: (productId, storeId, size, color) => {
        set({
          items: get().items.filter((i) => !matchesLine(i, productId, storeId, size, color)),
        });
      },
      updateQuantity: (productId, storeId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, storeId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            matchesLine(i, productId, storeId, size, color) ? { ...i, quantity } : i,
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
