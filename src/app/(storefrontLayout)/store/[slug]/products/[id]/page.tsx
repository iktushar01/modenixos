import ProductPageClient from "@/components/modules/storefront/pages/ProductPageClient";
import { getPublicProductAction } from "@/actions/catalog.actions";
import { Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const product = await getPublicProductAction(slug, id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const initialProduct = (await getPublicProductAction(slug, id)) as Product | null;

  return <ProductPageClient productId={id} initialProduct={initialProduct} />;
}
