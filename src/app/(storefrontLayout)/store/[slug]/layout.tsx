import { StorefrontCustomerProvider } from "@/components/modules/storefront/StorefrontCustomerContext";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";
import { hasStorefrontCustomerCookie } from "@/lib/storefrontCustomerApi";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const customer = (await hasStorefrontCustomerCookie(slug))
    ? await getStorefrontCustomerAction(slug)
    : null;

  return (
    <StorefrontCustomerProvider slug={slug} initialCustomer={customer}>
      {children}
    </StorefrontCustomerProvider>
  );
}
