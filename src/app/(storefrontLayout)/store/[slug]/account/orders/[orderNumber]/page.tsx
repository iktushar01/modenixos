import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { getMyOrderAction } from "@/actions/storefront-orders.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";
import StorefrontOrderDetailClient from "@/components/modules/storefront/account/StorefrontOrderDetailClient";
import { Category } from "@/types/store.types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ slug: string; orderNumber: string }>;
}) {
  const { slug, orderNumber } = await params;

  if (!(await hasStorefrontCustomerCookie(slug))) {
    redirect(`/store/${slug}/account/login?next=/account/orders/${encodeURIComponent(orderNumber)}`);
  }

  const [store, customer, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getStorefrontCustomerAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
  ]);

  if (!store) notFound();
  if (!customer) redirect(`/store/${slug}/account/login`);

  let order;
  try {
    order = await getMyOrderAction(slug, decodeURIComponent(orderNumber));
  } catch {
    notFound();
  }

  const categories = (categoriesRes.data ?? []) as Category[];
  return <StorefrontOrderDetailClient store={store} categories={categories} order={order} />;
}
