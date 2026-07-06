"use client";

import { useState } from "react";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductInfoTabs } from "./ProductInfoTabs";
import { ProductReviews } from "./ProductReviews";
import { RelatedProducts } from "./RelatedProducts";

export interface Theme2ProductDetailProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  relatedProducts: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  inWishlist: boolean;
}

export function Theme2ProductDetail({
  store,
  product,
  theme,
  relatedProducts,
  reviews,
  isLoggedIn,
  inWishlist,
}: Theme2ProductDetailProps) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const colorImages = product.details?.colorImages ?? {};

  return (
    <main className="sf-section w-full py-6 sm:py-8 md:py-12">
      <ProductBreadcrumbs store={store} product={product} />
      <ProductGallery product={product} selectedColor={color} colorImages={colorImages} />

      <div className="mt-10 grid gap-10 border-t sf-border pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="order-2 lg:order-1">
          <ProductInfoTabs product={product} store={store} theme={theme} />
          <ProductReviews storeSlug={store.slug} product={product} reviews={reviews} />
        </div>
        <div className="order-1 lg:sticky lg:top-28 lg:order-2 lg:self-start">
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

      <RelatedProducts
        store={store}
        products={relatedProducts}
        theme={theme}
        reviews={reviews}
      />
    </main>
  );
}
