"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import StorefrontLoginClient from "@/components/modules/storefront/account/StorefrontLoginClient";

import { StorefrontAuthSkeleton } from "@/components/modules/storefront/skeletons";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? undefined;
  const { slug, store, categories, customer, customerReady, storeReady } = useStorefront();

  useEffect(() => {
    if (!customerReady) return;
    if (customer) {
      const destination = nextPath
        ? `/store/${slug}${nextPath.startsWith("/") ? nextPath : `/${nextPath}`}`
        : `/store/${slug}/account/orders`;
      router.replace(destination);
    }
  }, [customer, customerReady, nextPath, router, slug]);

  if (!storeReady || !store || !customerReady || customer) {
    return <StorefrontAuthSkeleton fieldCount={2} />;
  }

  return <StorefrontLoginClient store={store} categories={categories} nextPath={nextPath} />;
}
