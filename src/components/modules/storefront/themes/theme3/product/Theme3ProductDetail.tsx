"use client";

import { useState } from "react";
import { Product, Review, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { ProductBreadcrumbs } from "../../theme1/product/ProductBreadcrumbs";
import { ProductGallery } from "../../theme1/product/ProductGallery";
import { ProductPurchasePanel } from "../../theme1/product/ProductPurchasePanel";
import { ProductInfoTabs } from "../../theme1/product/ProductInfoTabs";
import { ProductReviews } from "../../theme1/product/ProductReviews";
import { RelatedProducts } from "../../theme1/product/RelatedProducts";

export interface Theme3ProductDetailProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  relatedProducts: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  inWishlist: boolean;
}

export function Theme3ProductDetail({
  store,
  product,
  theme,
  relatedProducts,
  reviews,
  isLoggedIn,
  inWishlist,
}: Theme3ProductDetailProps) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const colorImages = product.details?.colorImages ?? {};

  return (
    <main className="sf-section w-full py-6 sm:py-8 md:py-12">
      <ProductBreadcrumbs store={store} product={product} />

      <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
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
        <div className="order-1 lg:order-2">
          <ProductGallery product={product} selectedColor={color} colorImages={colorImages} />
        </div>
      </div>

      <div className="mt-10 grid gap-8 border-t sf-border pt-10 lg:grid-cols-2">
        <ProductInfoTabs product={product} store={store} theme={theme} />
        <ProductReviews storeSlug={store.slug} product={product} reviews={reviews} />
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
