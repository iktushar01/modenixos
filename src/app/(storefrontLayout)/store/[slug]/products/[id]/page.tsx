import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import ProductPageClient from "@/components/modules/storefront/pages/ProductPageClient";
import { getPublicProductAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const product = await getPublicProductAction(slug, id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPageClient productId={id} />;
}
