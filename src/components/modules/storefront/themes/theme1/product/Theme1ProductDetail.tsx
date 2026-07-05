"use client";

import { useState } from "react";
import { Category, Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductInfoTabs } from "./ProductInfoTabs";
import { ProductReviews } from "./ProductReviews";
import { RelatedProducts } from "./RelatedProducts";

export interface Theme1ProductDetailProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  relatedProducts: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  inWishlist: boolean;
}

export function Theme1ProductDetail({
  store,
  product,
  theme,
  relatedProducts,
  reviews,
  isLoggedIn,
  inWishlist,
}: Theme1ProductDetailProps) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const colorImages = product.details?.colorImages ?? {};

  return (
    <main className="sf-section w-full py-8 md:py-12">
      <ProductBreadcrumbs store={store} product={product} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          product={product}
          selectedColor={color}
          colorImages={colorImages}
        />
        <div>
          <ProductPurchasePanel
            store={store}
            product={product}
            theme={theme}
            reviews={reviews}
            isLoggedIn={isLoggedIn}
            initialInWishlist={inWishlist}
            color={color}
            onColorChange={setColor}
          />
        </div>
      </div>

      <ProductInfoTabs product={product} store={store} theme={theme} />
      <ProductReviews storeSlug={store.slug} product={product} reviews={reviews} />
      <RelatedProducts
        store={store}
        products={relatedProducts}
        theme={theme}
        reviews={reviews}
      />
    </main>
  );
}
