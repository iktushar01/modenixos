import BillingPage from "@/components/modules/settings/BillingPage";
import { Suspense } from "react";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<DashboardFormSkeleton />}>
      <BillingPage />
    </Suspense>
  );
}
