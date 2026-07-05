import { notFound, redirect } from "next/navigation";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";
import StorefrontLoginClient from "@/components/modules/storefront/account/StorefrontLoginClient";
import { Category } from "@/types/store.types";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { slug } = await params;
  const { next } = await searchParams;
  const hasCookie = await hasStorefrontCustomerCookie(slug);
  const [store, categoriesRes, customer] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
    hasCookie ? getStorefrontCustomerAction(slug) : Promise.resolve(null),
  ]);
  if (!store) notFound();
  if (customer) {
    redirect(next ? `/store/${slug}${next.startsWith("/") ? next : `/${next}`}` : `/store/${slug}/account/orders`);
  }
  const categories = (categoriesRes.data ?? []) as Category[];
  return <StorefrontLoginClient store={store} categories={categories} nextPath={next} />;
}
