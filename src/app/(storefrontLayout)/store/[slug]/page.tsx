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

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const store = await getPublicStoreAction(slug);
  if (!store) notFound();

  const [catalogRes, categoriesRes, collectionsRes, reviewsRes] = await Promise.all([
    getPublicProductsAction(slug, { limit: "200", sort: "-createdAt" }),
    getPublicCategoriesAction(slug, { limit: "50" }),
    getPublicCollectionsAction(slug, { limit: "50" }),
    getPublicReviewsAction(slug, { limit: "10" }),
  ]);

  const catalog = (catalogRes.data ?? []) as Product[];
  const categories = (categoriesRes.data ?? []) as Category[];
  const collections = (collectionsRes.data ?? []) as Collection[];
  const reviews = (reviewsRes.data ?? []) as Review[];

  return (
    <StorefrontHomeClient
      store={store}
      catalog={catalog}
      categories={categories}
      collections={collections}
      reviews={reviews}
    />
  );
}
