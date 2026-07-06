import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction, getPublicProductsAction, getPublicCollectionsAction } from "@/actions/catalog.actions";
import { parseShopFilters, shopFiltersToApiParams } from "@/lib/shopFilters";
import { Collection, Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store ? `${store.brandName} — Shop` : "Shop",
    description: store?.description ?? undefined,
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") urlParams.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => urlParams.append(key, v));
  }

  const filters = parseShopFilters(urlParams);
  const productParams = shopFiltersToApiParams(filters, { limit: 48, page: Number(urlParams.get("page") ?? 1) });

  const [catalogRes, collectionsRes] = await Promise.all([
    getPublicProductsAction(slug, productParams),
    getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
  ]);

  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient
        initialCatalog={(catalogRes.data ?? []) as Product[]}
        initialCollections={(collectionsRes.data ?? []) as Collection[]}
        initialFilterKey={urlParams.toString()}
      />
    </Suspense>
  );
}
