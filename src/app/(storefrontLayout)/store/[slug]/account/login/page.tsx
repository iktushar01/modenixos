import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import StorefrontLoginClient from "@/components/modules/storefront/account/StorefrontLoginClient";
import { Category } from "@/types/store.types";

export default async function LoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();
  const customer = await getStorefrontCustomerAction(slug);
  if (customer) redirect(`/store/${slug}/account/wishlist`);
  const categoriesRes = await getPublicCategoriesAction(slug, { limit: "50" });
  const categories = (categoriesRes.data ?? []) as Category[];
  return <StorefrontLoginClient store={store} categories={categories} />;
}
