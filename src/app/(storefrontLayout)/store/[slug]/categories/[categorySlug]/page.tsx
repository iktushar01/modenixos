import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction } from "@/actions/catalog.actions";

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
  const { categorySlug } = await params;
  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient fixedCategory={categorySlug} />
    </Suspense>
  );
}
