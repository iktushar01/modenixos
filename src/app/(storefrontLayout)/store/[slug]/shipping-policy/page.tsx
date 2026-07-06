import StorePolicyPageClient from "@/components/modules/storefront/pages/StorePolicyPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `Shipping Policy — ${store.brandName}` : "Shipping Policy" };
}

export default function ShippingPolicyPage() {
  return <StorePolicyPageClient pageId="shipping-policy" />;
}
