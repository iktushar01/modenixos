import BillingPage from "@/components/modules/settings/BillingPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BillingPage />
    </Suspense>
  );
}
