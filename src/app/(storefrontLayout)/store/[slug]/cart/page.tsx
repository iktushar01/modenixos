import { notFound } from "next/navigation";
import { getPublicStoreAction } from "@/actions/catalog.actions";
import CartClient from "@/components/modules/storefront/CartClient";

export default async function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();
  return <CartClient store={store} />;
}
