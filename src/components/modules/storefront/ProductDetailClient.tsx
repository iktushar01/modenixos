"use client";

import { Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontPageShell } from "./StorefrontPageShell";
import { useStorefrontTheme } from "./StorefrontThemeShell";
import { resolveThemeProductDetail } from "./themes/registry";

interface ProductDetailClientProps {
  store: Store;
  product: Product;
  categories?: Category[];
  relatedProducts?: Product[];
  isLoggedIn?: boolean;
  inWishlist?: boolean;
}

function ProductDetailContent({
  store,
  product,
  relatedProducts,
  isLoggedIn,
  inWishlist,
}: Omit<ProductDetailClientProps, "categories">) {
  const { activeTheme } = useStorefrontTheme();
  const reviews = (product.reviews ?? []) as Review[];
  const ThemeProductDetail = resolveThemeProductDetail(activeTheme.templateId);

  return (
    <ThemeProductDetail
      store={store}
      product={product}
      theme={activeTheme}
      relatedProducts={relatedProducts ?? []}
      reviews={reviews}
      isLoggedIn={!!isLoggedIn}
      inWishlist={!!inWishlist}
    />
  );
}

export default function ProductDetailClient({
  store,
  product,
  categories = [],
  relatedProducts = [],
  isLoggedIn = false,
  inWishlist = false,
}: ProductDetailClientProps) {
  return (
    <StorefrontPageShell store={store} categories={categories}>
      <ProductDetailContent
        store={store}
        product={product}
        relatedProducts={relatedProducts}
        isLoggedIn={isLoggedIn}
        inWishlist={inWishlist}
      />
    </StorefrontPageShell>
  );
}
