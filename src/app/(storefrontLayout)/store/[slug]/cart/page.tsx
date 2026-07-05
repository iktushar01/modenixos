import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import CartClient from "@/components/modules/storefront/CartClient";
import { Category } from "@/types/store.types";

export default async function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();
  const categoriesRes = await getPublicCategoriesAction(slug, { limit: "50" });
  const categories = (categoriesRes.data ?? []) as Category[];
  return <CartClient store={store} categories={categories} />;
}
