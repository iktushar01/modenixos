import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { getMyOrdersAction } from "@/actions/storefront-orders.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";
import StorefrontOrdersClient from "@/components/modules/storefront/account/StorefrontOrdersClient";
import { Category } from "@/types/store.types";

export default async function OrdersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!(await hasStorefrontCustomerCookie(slug))) {
    redirect(`/store/${slug}/account/login?next=/account/orders`);
  }

  const [store, customer, categoriesRes, orders] = await Promise.all([
    getPublicStoreAction(slug),
    getStorefrontCustomerAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
    getMyOrdersAction(slug),
  ]);

  if (!store) notFound();
  if (!customer) redirect(`/store/${slug}/account/login?next=/account/orders`);

  const categories = (categoriesRes.data ?? []) as Category[];
  return <StorefrontOrdersClient store={store} categories={categories} orders={orders} />;
}
