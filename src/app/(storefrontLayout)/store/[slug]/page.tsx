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

const SHOP_FILTER_KEYS = [
  "category",
  "collection",
  "minPrice",
  "maxPrice",
  "size",
  "color",
  "tag",
  "sale",
  "search",
  "q",
] as const;

function hasActiveShopFilters(searchParams: Record<string, string | string[] | undefined>) {
  return SHOP_FILTER_KEYS.some((key) => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  });
}

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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const filteredShop = hasActiveShopFilters(resolvedSearchParams);

  const [store, catalogRes, categoriesRes, collectionsRes, reviewsRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicProductsAction(slug, {
      limit: filteredShop ? "100" : "36",
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(typeof resolvedSearchParams.category === "string"
        ? { category: resolvedSearchParams.category }
        : {}),
      ...(typeof resolvedSearchParams.collection === "string"
        ? { collection: resolvedSearchParams.collection }
        : {}),
    }),
    getPublicCategoriesAction(slug, { limit: "50" }),
    getPublicCollectionsAction(slug, { limit: "50" }),
    getPublicReviewsAction(slug, { limit: "10" }),
  ]);

  if (!store) notFound();

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
