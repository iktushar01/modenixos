import { DEFAULT_STOREFRONT_TYPOGRAPHY, typographyToCssVars } from "@/lib/storefront/fontPresets";

/** Fallback CSS variables for loading states before theme is resolved */
export const storefrontFontFallbackStyle = typographyToCssVars(DEFAULT_STOREFRONT_TYPOGRAPHY);
