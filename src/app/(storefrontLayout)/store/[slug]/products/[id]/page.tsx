import { notFound } from "next/navigation";
import {
  getPublicStoreAction,
  getPublicProductAction,
  getPublicCategoriesAction,
  getPublicProductsAction,
} from "@/actions/catalog.actions";
import { checkWishlistAction } from "@/actions/storefront-customer.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";
import ProductDetailClient from "@/components/modules/storefront/ProductDetailClient";
import { Category, Product } from "@/types/store.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const product = await getPublicProductAction(slug, id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const loggedIn = await hasStorefrontCustomerCookie(slug);

  const [store, product, categoriesRes, inWishlist] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicProductAction(slug, id),
    getPublicCategoriesAction(slug, { limit: "50" }),
    loggedIn ? checkWishlistAction(slug, id) : Promise.resolve(false),
  ]);

  if (!store || !product) notFound();

  const relatedRes = product.category?.slug
    ? await getPublicProductsAction(slug, { category: product.category.slug, limit: "8" })
    : { data: [] as Product[] };

  const categories = (categoriesRes.data ?? []) as Category[];
  const relatedProducts = ((relatedRes.data ?? []) as Product[])
    .filter((p) => p.id !== id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      store={store}
      product={product}
      categories={categories}
      relatedProducts={relatedProducts}
      isLoggedIn={loggedIn}
      inWishlist={inWishlist}
    />
  );
}
