import { StorefrontContextProvider } from "@/components/modules/storefront/StorefrontContext";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <StorefrontContextProvider slug={slug}>{children}</StorefrontContextProvider>;
}
