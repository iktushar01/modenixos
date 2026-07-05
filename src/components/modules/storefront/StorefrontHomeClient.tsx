"use client";

import { StorefrontRenderer } from "./StorefrontRenderer";
import { Collection, Category, Product, Review, Store } from "@/types/store.types";

interface StorefrontHomeClientProps {
  store: Store;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  reviews: Review[];
}

/** @deprecated Use StorefrontRenderer directly */
export function StorefrontHomeClient(props: StorefrontHomeClientProps) {
  return <StorefrontRenderer {...props} />;
}
