import { StorefrontCustomerProvider } from "@/components/modules/storefront/StorefrontCustomerContext";
import { getStorefrontCustomerAction } from "@/actions/storefront-customer.actions";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const customer = await getStorefrontCustomerAction(slug);

  return (
    <StorefrontCustomerProvider slug={slug} initialCustomer={customer}>
      {children}
    </StorefrontCustomerProvider>
  );
}
