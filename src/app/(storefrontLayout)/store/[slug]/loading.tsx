import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";
import { storefrontFontClassName } from "@/components/modules/storefront/fonts";

export default function StoreLoading() {
  return (
    <div
      className={`storefront-theme sf-bg min-h-screen animate-pulse ${storefrontFontClassName}`}
      style={cssVarsToStyle(CLASSIC_RETAIL_LIGHT)}
    >
      <div className="sf-announcement h-8" />
      <div className="sf-border sf-navbar h-20 border-b" />
      <div className="sf-skeleton mx-auto mt-0 h-[50vh] max-w-none" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-20 md:px-8">
        <div className="sf-skeleton h-10 w-56" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="sf-skeleton aspect-[3/4]" />
              <div className="sf-skeleton h-4 w-3/4" />
              <div className="sf-skeleton h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
