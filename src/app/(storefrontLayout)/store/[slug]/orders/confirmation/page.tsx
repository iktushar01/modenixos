import { Suspense } from "react";
import OrderConfirmationPageClient from "@/components/modules/storefront/pages/OrderConfirmationPageClient";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<StorefrontOrdersSkeleton />}>
      <OrderConfirmationPageClient />
    </Suspense>
  );
}
