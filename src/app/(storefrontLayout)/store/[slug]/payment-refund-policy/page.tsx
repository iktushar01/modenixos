import StorePolicyPageClient from "@/components/modules/storefront/pages/StorePolicyPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `Payment & Refund — ${store.brandName}` : "Payment & Refund" };
}

export default function PaymentRefundPolicyPage() {
  return <StorePolicyPageClient pageId="payment-refund-policy" />;
}
