"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import StorefrontRegisterClient from "@/components/modules/storefront/account/StorefrontRegisterClient";

import { StorefrontAuthSkeleton } from "@/components/modules/storefront/skeletons";

export default function RegisterPageClient() {
  const router = useRouter();
  const { slug, store, categories, customer, customerReady, storeReady } = useStorefront();

  useEffect(() => {
    if (customerReady && customer) {
      router.replace(`/store/${slug}/account/wishlist`);
    }
  }, [customer, customerReady, router, slug]);

  if (!storeReady || !store || !customerReady || customer) {
    return <StorefrontAuthSkeleton fieldCount={3} />;
  }

  return <StorefrontRegisterClient store={store} categories={categories} />;
}
