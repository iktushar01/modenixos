import { notFound } from "next/navigation";
import {
  getPublicStoreAction,
  getPublicProductsAction,
  getPublicCollectionsAction,
  getPublicCategoriesAction,
  getPublicReviewsAction,
} from "@/actions/catalog.actions";
import { StorefrontHomeClient } from "@/components/modules/storefront/StorefrontHomeClient";
import { Category, Collection, Product, Review } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store?.brandName ?? "Store",
    description: store?.description ?? undefined,
  };
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string; collection?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const store = await getPublicStoreAction(slug);
  if (!store) notFound();

  const productQuery: Record<string, string> = { limit: "24", sort: "-createdAt" };
  if (sp.category) productQuery.category = sp.category;
  if (sp.collection) productQuery.collection = sp.collection;

  const [productsRes, featuredRes, categoriesRes, collectionsRes, reviewsRes] = await Promise.all([
    getPublicProductsAction(slug, productQuery),
    sp.category || sp.collection
      ? getPublicProductsAction(slug, productQuery)
      : getPublicProductsAction(slug, { limit: "8", featured: "true" }),
    getPublicCategoriesAction(slug, { limit: "12" }),
    getPublicCollectionsAction(slug, { limit: "12" }),
    getPublicReviewsAction(slug, { limit: "10" }),
  ]);

  const products = (productsRes.data ?? []) as Product[];
  const featuredProducts = (featuredRes.data ?? []) as Product[];
  const categories = (categoriesRes.data ?? []) as Category[];
  const collections = (collectionsRes.data ?? []) as Collection[];
  const reviews = (reviewsRes.data ?? []) as Review[];

  const displayFeatured =
    sp.category || sp.collection ? products : featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  return (
    <StorefrontHomeClient
      store={store}
      products={products}
      featuredProducts={displayFeatured}
      categories={categories}
      collections={collections}
      reviews={reviews}
      activeCategory={sp.category ?? null}
    />
  );
}
