"use client";

import { Product, Store, StoreShippingConfig } from "@/types/store.types";

interface ProductDeliveryTabProps {
  product: Product;
  store: Store;
}

export function ProductDeliveryTab({ product, store }: ProductDeliveryTabProps) {
  const override = product.details?.deliveryOverride?.trim();
  const shipping = (store.shipping ?? {}) as StoreShippingConfig;
  const policy = override || shipping.deliveryPolicy?.trim();

  if (!policy) {
    return (
      <p className="sf-muted-fg text-sm">
        Delivery information is not available yet. Please contact the store for details.
      </p>
    );
  }

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed sf-fg">
      {policy}
    </div>
  );
}
