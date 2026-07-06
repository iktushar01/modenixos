"use client";

import { useEffect, useRef, useState } from "react";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { getPublicProductAction, getPublicProductsAction } from "@/actions/catalog.actions";
import { checkWishlistAction } from "@/actions/storefront-customer.actions";
import ProductDetailClient from "@/components/modules/storefront/ProductDetailClient";
import { Product } from "@/types/store.types";
import { StorefrontProductSkeleton } from "@/components/modules/storefront/skeletons";

export default function ProductPageClient({
  productId,
  initialProduct = null,
}: {
  productId: string;
  initialProduct?: Product | null;
}) {
  const { slug, store, categories, customer, customerReady, storeReady } = useStorefront();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const skipInitialLoad = useRef(Boolean(initialProduct));

  useEffect(() => {
    if (!storeReady) return;

    let cancelled = false;

    async function loadRelatedAndWishlist(fetchedProduct: Product) {
      const [relatedRes, wishlist] = await Promise.all([
        fetchedProduct.category?.slug
          ? getPublicProductsAction(slug, { category: fetchedProduct.category.slug, limit: "8" })
          : Promise.resolve({ data: [] as Product[] }),
        customerReady && customer
          ? checkWishlistAction(slug, productId).catch(() => false)
          : Promise.resolve(false),
      ]);

      if (cancelled) return;

      setRelatedProducts(
        ((relatedRes.data ?? []) as Product[]).filter((p) => p.id !== productId).slice(0, 4),
      );
      setInWishlist(wishlist);
    }

    if (skipInitialLoad.current && initialProduct) {
      skipInitialLoad.current = false;
      loadRelatedAndWishlist(initialProduct);
      return () => {
        cancelled = true;
      };
    }

    setNotFound(false);

    async function load() {
      try {
        const fetchedProduct = await getPublicProductAction(slug, productId);
        if (cancelled) return;

        if (!fetchedProduct) {
          setNotFound(true);
          setProduct(null);
          return;
        }

        setProduct(fetchedProduct as Product);
        await loadRelatedAndWishlist(fetchedProduct as Product);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setProduct(null);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, productId, customer, customerReady, storeReady, initialProduct]);

  if (!storeReady || !store) {
    return <StorefrontProductSkeleton />;
  }

  if (notFound || !product) {
    if (!notFound && !product) {
      return <StorefrontProductSkeleton />;
    }
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
