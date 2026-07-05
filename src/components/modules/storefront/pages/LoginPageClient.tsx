"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import StorefrontLoginClient from "@/components/modules/storefront/account/StorefrontLoginClient";

import { StorefrontAuthSkeleton } from "@/components/modules/storefront/skeletons";

export default function LoginPageClient() {
  const router = useRouter();
  const { slug, store, categories, customer, customerReady } = useStorefront();

  useEffect(() => {
    if (customerReady && customer) {
      router.replace(`/store/${slug}/account/wishlist`);
    }
  }, [customer, customerReady, router, slug]);

  if (!customerReady || customer) {
    return <StorefrontAuthSkeleton fieldCount={2} />;
  }

  return <StorefrontLoginClient store={store} categories={categories} />;
}
