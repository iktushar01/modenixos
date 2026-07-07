import { cookies } from "next/headers";
import { StorefrontContextProvider } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontInnerLayout } from "@/components/modules/storefront/StorefrontInnerLayout";
import { StorefrontLayoutClient } from "@/components/modules/storefront/StorefrontLayoutClient";
import { StorefrontAnalyticsTracker } from "@/components/modules/storefront/StorefrontAnalyticsTracker";
import { readColorModeFromCookie } from "@/lib/storefront/colorModeStorage";
import { getPublicStoreAction, getPublicCategoriesAction } from "@/actions/catalog.actions";
import { Category, Store } from "@/types/store.types";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const initialColorMode = readColorModeFromCookie(cookieStore, slug);

  const [initialStore, categoriesRes] = await Promise.all([
    getPublicStoreAction(slug),
    getPublicCategoriesAction(slug, { limit: "50", sortBy: "sortOrder", sortOrder: "asc" }),
  ]);

  return (
    <StorefrontContextProvider
      key={slug}
      slug={slug}
      initialColorMode={initialColorMode}
      initialStore={(initialStore as Store) ?? null}
      initialCategories={(categoriesRes.data ?? []) as Category[]}
    >
      <StorefrontLayoutClient>
        <StorefrontAnalyticsTracker />
        <StorefrontInnerLayout>{children}</StorefrontInnerLayout>
      </StorefrontLayoutClient>
    </StorefrontContextProvider>
  );
}
