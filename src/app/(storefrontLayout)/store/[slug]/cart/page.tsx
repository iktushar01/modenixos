import CartPageClient from "@/components/modules/storefront/pages/CartPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `${store.brandName} — Cart` : "Cart" };
}

export default function CartPage() {
  return <CartPageClient />;
}
