import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import OrderConfirmationClient from "@/components/modules/storefront/account/OrderConfirmationClient";
import { trackGuestOrderAction } from "@/actions/storefront-orders.actions";
import { Category } from "@/types/store.types";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string; email?: string }>;
}) {
  const { slug } = await params;
  const { order: orderNumber, email } = await searchParams;

  if (!orderNumber || !email) notFound();

  const [store, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
  ]);

  if (!store) notFound();

  let order;
  try {
    order = await trackGuestOrderAction(slug, orderNumber, email);
  } catch {
    notFound();
  }

  const categories = (categoriesRes.data ?? []) as Category[];
  return <OrderConfirmationClient store={store} categories={categories} order={order} />;
}
