"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductDescriptionTab } from "../../theme1/product/ProductDescriptionTab";
import { ProductDeliveryTab } from "../../theme1/product/ProductDeliveryTab";
import { Product, Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";

type PanelId = "description" | "delivery";

interface ProductInfoTabsProps {
  product: Product;
  store: Store;
  theme: StorefrontThemeConfig;
}

const PANELS: { id: PanelId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "delivery", label: "Delivery & returns" },
];

export function ProductInfoTabs({ product, store, theme }: ProductInfoTabsProps) {
  const [openPanel, setOpenPanel] = useState<PanelId>("description");

  return (
    <div className="sf-t2-accordion mt-12 border-t sf-border">
      {PANELS.map((panel) => {
        const isOpen = openPanel === panel.id;
        return (
          <div key={panel.id} className="border-b sf-border">
            <button
              type="button"
              className="sf-t2-accordion-trigger flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpenPanel(isOpen ? "description" : panel.id)}
              aria-expanded={isOpen}
            >
              <span className="sf-t2-label">{panel.label}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="sf-t2-accordion-body pb-6">
                {panel.id === "description" ? (
                  <ProductDescriptionTab product={product} theme={theme} />
                ) : (
                  <ProductDeliveryTab product={product} store={store} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
