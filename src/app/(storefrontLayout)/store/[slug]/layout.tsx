import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getPublicStoreAction } from "@/actions/catalog.actions";
import { StorefrontContextProvider } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontLayoutClient } from "@/components/modules/storefront/StorefrontLayoutClient";
import { STORE_FAVICON } from "@/lib/app-config";
import { readColorModeFromCookie } from "@/lib/storefront/colorModeStorage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  const icon = store?.logo ?? STORE_FAVICON;

  return {
    icons: {
      icon: [{ url: icon }],
      apple: [{ url: icon }],
    },
  };
}

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

  return (
    <StorefrontContextProvider slug={slug} initialColorMode={initialColorMode}>
      <StorefrontLayoutClient>{children}</StorefrontLayoutClient>
    </StorefrontContextProvider>
  );
}
