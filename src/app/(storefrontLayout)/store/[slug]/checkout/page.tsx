import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import CheckoutClient from "@/components/modules/storefront/CheckoutClient";
import { Category } from "@/types/store.types";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [store, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
  ]);
  if (!store) notFound();

  const categories = (categoriesRes.data ?? []) as Category[];

  return <CheckoutClient store={store} categories={categories} />;
}
