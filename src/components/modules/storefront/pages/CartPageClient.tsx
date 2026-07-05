"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import CartClient from "@/components/modules/storefront/CartClient";

export default function CartPageClient() {
  const { store, categories } = useStorefront();
  return <CartClient store={store} categories={categories} />;
}
