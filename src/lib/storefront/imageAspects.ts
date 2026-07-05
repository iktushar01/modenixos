/** Storefront display ratios — keep dashboard crop UI in sync with grids */

export const STOREFRONT_CATEGORY_ASPECT = 4 / 5;

export const STOREFRONT_COLLECTION_ASPECT = 3 / 4;

export const STOREFRONT_CATEGORY_RATIO = {
  label: "4:5 (storefront)",
  value: STOREFRONT_CATEGORY_ASPECT,
} as const;

export const STOREFRONT_COLLECTION_RATIO = {
  label: "3:4 (storefront)",
  value: STOREFRONT_COLLECTION_ASPECT,
} as const;
