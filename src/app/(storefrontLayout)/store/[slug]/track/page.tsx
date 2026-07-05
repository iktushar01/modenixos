import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import StorefrontTrackOrderClient from "@/components/modules/storefront/account/StorefrontTrackOrderClient";
import { Category } from "@/types/store.types";

export default async function TrackOrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [store, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
  ]);

  if (!store) notFound();

  const categories = (categoriesRes.data ?? []) as Category[];
  return <StorefrontTrackOrderClient store={store} categories={categories} />;
}
