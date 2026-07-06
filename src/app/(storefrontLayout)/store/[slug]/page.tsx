import { Suspense } from "react";
import StoreHomePageClient from "@/components/modules/storefront/pages/StoreHomePageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return {
    title: store?.brandName ?? "Store",
    description: store?.description ?? undefined,
  };
}

export default function StorePage() {
  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <StoreHomePageClient />
    </Suspense>
  );
}
