"use client";

import { Eye } from "lucide-react";

export function StorefrontPreviewBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-[70] flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-950 dark:text-amber-100"
    >
      <Eye className="h-4 w-4 shrink-0" aria-hidden />
      <span>
        <strong>Preview mode</strong> — Your storefront is unpublished. Only you can see this page.
      </span>
    </div>
  );
}
