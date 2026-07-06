import { Suspense } from "react";
import ShopPageClient from "@/components/modules/storefront/pages/ShopPageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store ? `${store.brandName} — Shop` : "Shop",
    description: store?.description ?? undefined,
  };
}

export default function ShopPage() {
  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}
