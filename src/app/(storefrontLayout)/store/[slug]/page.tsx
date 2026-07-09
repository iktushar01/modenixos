import { Suspense } from "react";
import StoreHomePageClient from "@/components/modules/storefront/pages/StoreHomePageClient";
import { StorefrontHomeSkeleton } from "@/components/modules/storefront/skeletons";
import {
  getPublicStoreAction,
  getPublicProductsAction,
  getPublicCollectionsAction,
  getPublicReviewsAction,
} from "@/actions/catalog.actions";
import { Collection, Product, Review } from "@/types/store.types";

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

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [catalogRes, collectionsRes, reviewsRes] = await Promise.all([
    getPublicProductsAction(slug, { limit: "36", sortBy: "sortOrder", sortOrder: "asc" }),
    getPublicCollectionsAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
    getPublicReviewsAction(slug, { limit: "10" }),
  ]);

  const initialCatalog = (catalogRes.data ?? []) as Product[];
  const initialCollections = (collectionsRes.data ?? []) as Collection[];
  const initialReviews = (reviewsRes.data ?? []) as Review[];

  return (
    <Suspense fallback={<StorefrontHomeSkeleton />}>
      <StoreHomePageClient
        initialCatalog={initialCatalog}
        initialCollections={initialCollections}
        initialReviews={initialReviews}
      />
    </Suspense>
  );
}
