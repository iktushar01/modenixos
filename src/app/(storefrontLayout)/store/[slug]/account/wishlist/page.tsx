import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import {
  getStorefrontCustomerAction,
  getWishlistAction,
} from "@/actions/storefront-customer.actions";
import WishlistClient from "@/components/modules/storefront/account/WishlistClient";
import { Category } from "@/types/store.types";

export default async function WishlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();
  const customer = await getStorefrontCustomerAction(slug);
  if (!customer) redirect(`/store/${slug}/account/login`);
  const [categoriesRes, items] = await Promise.all([
    getPublicCategoriesAction(slug, { limit: "50" }),
    getWishlistAction(slug),
  ]);
  const categories = (categoriesRes.data ?? []) as Category[];
  return <WishlistClient store={store} categories={categories} items={items} />;
}
