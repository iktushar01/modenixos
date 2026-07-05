import { ReactNode } from "react";
import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";
import { storefrontFontFallbackStyle } from "@/components/modules/storefront/fonts";

interface StorefrontLoadingShellProps {
  children: ReactNode;
}

export function StorefrontLoadingShell({ children }: StorefrontLoadingShellProps) {
  return (
    <div
      className="storefront-theme sf-bg min-h-screen animate-pulse"
      style={{ ...cssVarsToStyle(CLASSIC_RETAIL_LIGHT), ...storefrontFontFallbackStyle }}
    >
      <div className="sf-announcement h-8" />
      <div className="sf-border sf-navbar border-b">
        <div className="sf-section flex h-20 items-center justify-between gap-4">
          <div className="sf-skeleton h-6 w-28 shrink-0 md:w-36" />
          <div className="hidden flex-1 justify-center gap-8 md:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="sf-skeleton h-3 w-14" />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <div className="sf-skeleton hidden h-9 w-9 rounded-full sm:block" />
            <div className="sf-skeleton h-9 w-9 rounded-full" />
            <div className="sf-skeleton h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
      {children}
      <footer className="sf-border mt-auto border-t">
        <div className="sf-section py-14 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="sf-skeleton h-4 w-24" />
                <div className="sf-skeleton h-3 w-full max-w-[10rem]" />
                <div className="sf-skeleton h-3 w-full max-w-[8rem]" />
                <div className="sf-skeleton h-3 w-full max-w-[9rem]" />
              </div>
            ))}
          </div>
          <div className="sf-skeleton mt-12 h-3 w-48" />
        </div>
      </footer>
    </div>
  );
}
