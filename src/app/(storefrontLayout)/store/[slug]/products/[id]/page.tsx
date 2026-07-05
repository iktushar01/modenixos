import { notFound } from "next/navigation";
import {
  getPublicStoreAction,
  getPublicProductAction,
  getPublicCategoriesAction,
  getPublicProductsAction,
} from "@/actions/catalog.actions";
import {
  checkWishlistAction,
  getStorefrontCustomerAction,
} from "@/actions/storefront-customer.actions";
import ProductDetailClient from "@/components/modules/storefront/ProductDetailClient";
import { Category, Product } from "@/types/store.types";

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

  const [categoriesRes, relatedRes, customer] = await Promise.all([
    getPublicCategoriesAction(slug, { limit: "50" }),
    product.category?.slug
      ? getPublicProductsAction(slug, { category: product.category.slug, limit: "8" })
      : Promise.resolve({ data: [] }),
    getStorefrontCustomerAction(slug),
  ]);

  const categories = (categoriesRes.data ?? []) as Category[];
  const relatedProducts = ((relatedRes.data ?? []) as Product[])
    .filter((p) => p.id !== id)
    .slice(0, 4);

  const inWishlist = customer
    ? await checkWishlistAction(slug, id)
    : false;

  return (
    <ProductDetailClient
      store={store}
      product={product}
      categories={categories}
      relatedProducts={relatedProducts}
      isLoggedIn={!!customer}
      inWishlist={inWishlist}
    />
  );
}
