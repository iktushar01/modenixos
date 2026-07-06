import AboutPageClient from "@/components/modules/storefront/pages/AboutPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `About — ${store.brandName}` : "About" };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
