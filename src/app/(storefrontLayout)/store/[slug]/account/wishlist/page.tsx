import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import {
  getStorefrontCustomerAction,
  getWishlistAction,
} from "@/actions/storefront-customer.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";
import WishlistClient from "@/components/modules/storefront/account/WishlistClient";
import { Category } from "@/types/store.types";

export default async function WishlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!(await hasStorefrontCustomerCookie(slug))) {
    redirect(`/store/${slug}/account/login`);
  }

  const [store, customer, categoriesRes, items] = await Promise.all([
    getPublicStoreAction(slug),
    getStorefrontCustomerAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
    getWishlistAction(slug),
  ]);

  if (!store) notFound();
  if (!customer) redirect(`/store/${slug}/account/login`);

  const categories = (categoriesRes.data ?? []) as Category[];
  return <WishlistClient store={store} categories={categories} items={items} />;
}
