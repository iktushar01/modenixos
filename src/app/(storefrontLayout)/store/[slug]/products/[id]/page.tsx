import { notFound } from "next/navigation";
import { getPublicStoreAction, getPublicProductAction } from "@/actions/catalog.actions";
import ProductDetailClient from "@/components/modules/storefront/ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const product = await getPublicProductAction(slug, id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const store = await getPublicStoreAction(slug);
  const product = await getPublicProductAction(slug, id);
  if (!store || !product) notFound();

  return <ProductDetailClient store={store} product={product} />;
}
