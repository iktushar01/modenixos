import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";

export default function CartLoading() {
  return (
    <div
      className="storefront-theme sf-bg min-h-screen animate-pulse"
      style={cssVarsToStyle(CLASSIC_RETAIL_LIGHT)}
    >
      <div className="sf-border sf-navbar h-16 border-b" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="sf-skeleton mb-10 h-10 w-48 rounded" />
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sf-skeleton h-32 rounded-2xl" />
            ))}
          </div>
          <div className="sf-skeleton h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
