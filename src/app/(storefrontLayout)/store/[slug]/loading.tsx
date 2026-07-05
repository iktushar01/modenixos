import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";

export default function StoreLoading() {
  return (
    <div
      className="storefront-theme sf-bg min-h-screen animate-pulse"
      style={cssVarsToStyle(CLASSIC_RETAIL_LIGHT)}
    >
      <div className="sf-border sf-navbar h-16 border-b" />
      <div className="sf-muted min-h-[85vh]" />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-20 md:px-6">
        <div className="sf-skeleton h-8 w-48 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="sf-skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
