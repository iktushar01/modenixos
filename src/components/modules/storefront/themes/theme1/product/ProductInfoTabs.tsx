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
    <div className="mt-12 border-t pt-8 sf-border">
      <div className="mb-6 flex gap-8 border-b sf-border">
        {(["description", "delivery"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "pb-3 text-sm font-semibold uppercase tracking-wide transition-colors",
              tab === id
                ? "sf-fg border-b-2 border-[var(--sf-primary)]"
                : "sf-muted-fg hover:opacity-80",
            )}
          >
            {id === "description" ? "Description" : "Delivery Options"}
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
