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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const fetchedProduct = await getPublicProductAction(slug, productId);
        if (cancelled) return;

        if (!fetchedProduct) {
          setNotFound(true);
          setReady(true);
          return;
        }

        const [relatedRes, wishlist] = await Promise.all([
          fetchedProduct.category?.slug
            ? getPublicProductsAction(slug, { category: fetchedProduct.category.slug, limit: "8" })
            : Promise.resolve({ data: [] as Product[] }),
          customerReady && customer
            ? checkWishlistAction(slug, productId).catch(() => false)
            : Promise.resolve(false),
        ]);

        if (cancelled) return;

        setProduct(fetchedProduct as Product);
        setRelatedProducts(
          ((relatedRes.data ?? []) as Product[]).filter((p) => p.id !== productId).slice(0, 4),
        );
        setInWishlist(wishlist);
        setReady(true);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setReady(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, productId, customer, customerReady]);

  if (!ready) {
    return <StorefrontProductSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="text-muted-foreground">
          This product may have been removed or is temporarily unavailable.
        </p>
      </div>
    );
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
