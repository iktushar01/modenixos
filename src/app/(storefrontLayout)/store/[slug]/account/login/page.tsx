import LoginPageClient from "@/components/modules/storefront/pages/LoginPageClient";
import { StorefrontAuthSkeleton } from "@/components/modules/storefront/skeletons";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<StorefrontAuthSkeleton fieldCount={2} />}>
      <LoginPageClient />
    </Suspense>
  );
}
