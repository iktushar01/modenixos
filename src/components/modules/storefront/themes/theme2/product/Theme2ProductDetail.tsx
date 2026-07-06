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

      <div className="mx-auto max-w-5xl">
        <ProductGallery
          product={product}
          selectedColor={color}
          colorImages={colorImages}
        />

        <div className="mt-8 border-t sf-border pt-8 md:mt-12 md:pt-12">
          <div className="mx-auto max-w-xl">
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
      </div>

      <div className="mx-auto mt-10 max-w-3xl md:mt-14">
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
