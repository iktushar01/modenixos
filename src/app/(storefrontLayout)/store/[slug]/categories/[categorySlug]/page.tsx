import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import {
  getPublicStoreAction,
  getPublicProductsAction,
  getPublicCollectionsAction,
} from "@/actions/catalog.actions";
import { shopFiltersToApiParams } from "@/lib/shopFilters";
import { Collection, Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; categorySlug: string }> }) {
  const { slug, categorySlug } = await params;
  const store = await getPublicStoreAction(slug);
  const name = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: store ? `${name} — ${store.brandName}` : name,
    description: store?.description ?? undefined,
  };
}

export default async function CategoryShopPage({
  params,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}) {
  const { slug, categorySlug } = await params;

  const [catalogRes, collectionsRes] = await Promise.all([
    getPublicProductsAction(
      slug,
      shopFiltersToApiParams({ sort: "newest", category: categorySlug }, { limit: 48 }),
    ),
    getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
  ]);

  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient
        fixedCategory={categorySlug}
        initialCatalog={(catalogRes.data ?? []) as Product[]}
        initialCollections={(collectionsRes.data ?? []) as Collection[]}
        initialFilterKey={`category=${encodeURIComponent(categorySlug)}`}
      />
    </Suspense>
  );
}
