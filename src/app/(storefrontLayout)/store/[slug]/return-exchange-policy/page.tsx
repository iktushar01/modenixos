import StorePolicyPageClient from "@/components/modules/storefront/pages/StorePolicyPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `Return & Exchange — ${store.brandName}` : "Return & Exchange" };
}

export default function ReturnExchangePolicyPage() {
  return <StorePolicyPageClient pageId="return-exchange-policy" />;
}
