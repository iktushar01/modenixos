import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction, getPublicProductsAction, getPublicCollectionsAction } from "@/actions/catalog.actions";
import { Collection, Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store ? `${store.brandName} — Shop` : "Shop",
    description: store?.description ?? undefined,
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [catalogRes, collectionsRes] = await Promise.all([
    getPublicProductsAction(slug, { limit: "48", sortBy: "sortOrder", sortOrder: "asc" }),
    getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
  ]);

  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient
        initialCatalog={(catalogRes.data ?? []) as Product[]}
        initialCollections={(collectionsRes.data ?? []) as Collection[]}
      />
    </Suspense>
  );
}
