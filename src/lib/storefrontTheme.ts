/** @deprecated Import from `@/lib/storefront` instead */
export {
  parseStorefrontTheme,
  buildThemePayload,
  type StorefrontThemeConfig,
  type StorefrontSections,
  type StorefrontColorPalette,
  type StorefrontColorMode,
  type StorefrontTemplateId,
} from "@/lib/storefront";

import { Product } from "@/types/store.types";

export { formatPrice } from "@/lib/currency";

export function productDisplayPrice(product: { price: number; discountPrice?: number | null }) {
  const sale = product.discountPrice ?? null;
  return {
    price: sale ?? product.price,
    compareAt: sale ? product.price : null,
    discountPercent:
      sale && sale < product.price
        ? Math.round((1 - sale / product.price) * 100)
        : null,
  };
}
