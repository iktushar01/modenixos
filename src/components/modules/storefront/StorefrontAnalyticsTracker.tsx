"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { trackStorefrontEvent } from "@/lib/storefrontAnalytics";

const PRODUCT_PATH_RE = /\/products\/([^/]+)/;

export function StorefrontAnalyticsTracker() {
  const { slug } = useStorefront();
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!slug || !pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    trackStorefrontEvent(slug, "page_view", { path: pathname });

    const productMatch = pathname.match(PRODUCT_PATH_RE);
    if (productMatch?.[1]) {
      trackStorefrontEvent(slug, "product_view", {
        path: pathname,
        productId: productMatch[1],
      });
    }

    if (pathname.includes("/checkout")) {
      trackStorefrontEvent(slug, "checkout_started", { path: pathname });
    }
  }, [slug, pathname]);

  return null;
}
