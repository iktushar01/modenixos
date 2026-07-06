"use client";

import { useEffect } from "react";
import { STATIC_PAGE_LABELS, StoreStaticPageId } from "@/lib/storefront/storeStaticPages";

export function StorePageTitle({
  pageId,
  brandName,
}: {
  pageId: StoreStaticPageId;
  brandName: string;
}) {
  useEffect(() => {
    const label = STATIC_PAGE_LABELS[pageId];
    document.title = `${label} — ${brandName}`;
  }, [pageId, brandName]);

  return null;
}
