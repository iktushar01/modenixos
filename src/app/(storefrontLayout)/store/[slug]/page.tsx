import { notFound } from "next/navigation";
import {
  getPublicStoreAction,
  getPublicProductsAction,
  getPublicCollectionsAction,
  getPublicReviewsAction,
} from "@/actions/catalog.actions";
import { StorefrontHomeClient } from "@/components/modules/storefront/StorefrontHomeClient";
import { Collection, Product, Review } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store?.brandName ?? "Store",
    description: store?.description ?? undefined,
  };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await getPublicStoreAction(slug);
  if (!store) notFound();

  const [productsRes, featuredRes, collectionsRes, reviewsRes] = await Promise.all([
    getPublicProductsAction(slug, { limit: "24", sort: "-createdAt" }),
    getPublicProductsAction(slug, { limit: "8", featured: "true" }),
    getPublicCollectionsAction(slug, { limit: "12" }),
    getPublicReviewsAction(slug, { limit: "10" }),
  ]);

  const products = (productsRes.data ?? []) as Product[];
  const featuredProducts = (featuredRes.data ?? []) as Product[];
  const collections = (collectionsRes.data ?? []) as Collection[];
  const reviews = (reviewsRes.data ?? []) as Review[];

  return (
    <StorefrontHomeClient
      store={store}
      products={products}
      featuredProducts={featuredProducts}
      collections={collections}
      reviews={reviews}
    />
  );
}
