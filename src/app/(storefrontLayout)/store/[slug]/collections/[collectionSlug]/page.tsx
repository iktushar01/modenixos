import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; collectionSlug: string }> }) {
  const { slug, collectionSlug } = await params;
  const store = await getPublicStoreAction(slug);
  const name = collectionSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: store ? `${name} — ${store.brandName}` : name,
    description: store?.description ?? undefined,
  };
}

export default async function CollectionShopPage({
  params,
}: {
  params: Promise<{ slug: string; collectionSlug: string }>;
}) {
  const { collectionSlug } = await params;
  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient fixedCollection={collectionSlug} />
    </Suspense>
  );
}
