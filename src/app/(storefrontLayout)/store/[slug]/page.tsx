import { Suspense } from "react";
import StoreHomePageClient from "@/components/modules/storefront/pages/StoreHomePageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  const title = store?.brandName ?? "Store";
  const description = store?.description ?? undefined;
  const images = store?.logo ? [{ url: store.logo }] : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
  };
}

export default function StorePage() {
  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <StoreHomePageClient />
    </Suspense>
  );
}
