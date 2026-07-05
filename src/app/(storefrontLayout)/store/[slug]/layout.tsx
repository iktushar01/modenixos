import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getPublicStoreAction,
  getPublicCategoriesAction,
} from "@/actions/catalog.actions";
import { StorefrontContextProvider } from "@/components/modules/storefront/StorefrontContext";
import { Category } from "@/types/store.types";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [store, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50" }),
  ]);

  if (!store) notFound();

  const categories = (categoriesRes.data ?? []) as Category[];

  return (
    <StorefrontContextProvider slug={slug} store={store} categories={categories}>
      <Suspense fallback={null}>{children}</Suspense>
    </StorefrontContextProvider>
  );
}
