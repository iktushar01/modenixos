import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";
import { storefrontFontClassName } from "@/components/modules/storefront/fonts";

export default function CartLoading() {
  return (
    <div
      className={`storefront-theme sf-bg min-h-screen animate-pulse ${storefrontFontClassName}`}
      style={cssVarsToStyle(CLASSIC_RETAIL_LIGHT)}
    >
      <div className="sf-border sf-navbar h-20 border-b" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="sf-skeleton mb-10 h-12 w-56" />
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sf-skeleton h-36" />
            ))}
          </div>
          <div className="sf-skeleton h-72" />
        </div>
      </div>
    </div>
  );
}
