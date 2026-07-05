"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import CheckoutClient from "@/components/modules/storefront/CheckoutClient";

export default function CheckoutPageClient() {
  const { store, categories } = useStorefront();
  return <CheckoutClient store={store} categories={categories} />;
}
