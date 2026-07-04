import { notFound } from "next/navigation";
import { getPublicStoreAction } from "@/actions/catalog.actions";
import CheckoutClient from "@/components/modules/storefront/CheckoutClient";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();
  return <CheckoutClient store={store} />;
}
