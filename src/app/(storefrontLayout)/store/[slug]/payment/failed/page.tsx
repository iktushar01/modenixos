import { Suspense } from "react";
import StorePaymentStatusPageClient from "@/components/modules/storefront/pages/StorePaymentStatusPageClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";

export default function StorePaymentFailedPage() {
  return (
    <Suspense fallback={<StorefrontOrdersSkeleton />}>
      <StorePaymentStatusPageClient status="failed" />
    </Suspense>
  );
}
