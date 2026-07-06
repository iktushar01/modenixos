import CheckoutPageClient from "@/components/modules/storefront/pages/CheckoutPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `${store.brandName} — Checkout` : "Checkout" };
}

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
