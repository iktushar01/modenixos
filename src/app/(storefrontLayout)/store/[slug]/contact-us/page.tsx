import ContactUsPageClient from "@/components/modules/storefront/pages/ContactUsPageClient";
import { getPublicStoreAction } from "@/actions/catalog.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getPublicStoreAction(slug);
  return { title: store ? `Contact Us — ${store.brandName}` : "Contact Us" };
}

export default function ContactUsPage() {
  return <ContactUsPageClient />;
}
