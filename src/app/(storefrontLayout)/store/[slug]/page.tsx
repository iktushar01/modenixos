import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicProductsAction } from "@/actions/catalog.actions";
import { StorefrontHome } from "@/components/modules/storefront/StorefrontHome";
import { Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store?.brandName ?? "Store" };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  if (!store) notFound();

  const productsRes = await getPublicProductsAction(slug, { limit: "12" });
  const products = (productsRes.data ?? []) as Product[];

  return <StorefrontHome store={store} products={products} />;
}
