"use client";

import { useEffect, useState } from "react";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { getPublicProductAction, getPublicProductsAction } from "@/actions/catalog.actions";
import { checkWishlistAction } from "@/actions/storefront-customer.actions";
import ProductDetailClient from "@/components/modules/storefront/ProductDetailClient";
import { Product } from "@/types/store.types";
import { StorefrontProductSkeleton } from "@/components/modules/storefront/skeletons";

export default function ProductPageClient({ productId }: { productId: string }) {
  const { slug, store, categories, customer, customerReady } = useStorefront();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const fetchedProduct = await getPublicProductAction(slug, productId);
      if (cancelled || !fetchedProduct) {
        if (!cancelled) setReady(true);
        return;
      }

      const [relatedRes, wishlist] = await Promise.all([
        fetchedProduct.category?.slug
          ? getPublicProductsAction(slug, { category: fetchedProduct.category.slug, limit: "8" })
          : Promise.resolve({ data: [] as Product[] }),
        customerReady && customer
          ? checkWishlistAction(slug, productId)
          : Promise.resolve(false),
      ]);

      if (cancelled) return;

      setProduct(fetchedProduct as Product);
      setRelatedProducts(
        ((relatedRes.data ?? []) as Product[]).filter((p) => p.id !== productId).slice(0, 4),
      );
      setInWishlist(wishlist);
      setReady(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, productId, customer, customerReady]);

  if (!ready || !product) {
    return <StorefrontProductSkeleton />;
  }

  return (
    <ProductDetailClient
      store={store}
      product={product}
      categories={categories}
      relatedProducts={relatedProducts}
      isLoggedIn={!!customer}
      inWishlist={inWishlist}
    />
  );
}
