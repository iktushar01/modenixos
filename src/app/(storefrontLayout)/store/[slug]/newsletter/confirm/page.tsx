import { Suspense } from "react";
import NewsletterStatusPageClient from "@/components/modules/storefront/pages/NewsletterStatusPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="sf-section py-20 text-center">Loading…</div>}>
      <NewsletterStatusPageClient mode="confirm" />
    </Suspense>
  );
}
