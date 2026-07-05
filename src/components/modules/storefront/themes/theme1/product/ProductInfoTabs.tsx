"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductDescriptionTab } from "./ProductDescriptionTab";
import { ProductDeliveryTab } from "./ProductDeliveryTab";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";

type TabId = "description" | "delivery";

interface ProductInfoTabsProps {
  product: Product;
  store: Store;
  theme: StorefrontThemeConfig;
}

export function ProductInfoTabs({ product, store, theme }: ProductInfoTabsProps) {
  const [tab, setTab] = useState<TabId>("description");

  return (
    <div className="mt-16 border-t pt-10 sf-border">
      <div className="mb-8 flex flex-wrap gap-2">
        {(["description", "delivery"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
              tab === id ? "sf-filter-pill-active" : "sf-filter-pill",
            )}
          >
            {id === "description" ? "Description" : "Delivery"}
          </button>
        ))}
      </div>
      {tab === "description" ? (
        <ProductDescriptionTab product={product} theme={theme} />
      ) : (
        <ProductDeliveryTab product={product} store={store} />
      )}
    </div>
  );
}
