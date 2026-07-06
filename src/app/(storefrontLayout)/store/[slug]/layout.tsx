import { cookies } from "next/headers";
import { StorefrontContextProvider } from "@/components/modules/storefront/StorefrontContext";
import { readColorModeFromCookie } from "@/lib/storefront/colorModeStorage";

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
      {children}
    </StorefrontContextProvider>
  );
}
