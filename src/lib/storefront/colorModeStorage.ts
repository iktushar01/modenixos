import type { StorefrontColorMode } from "./types";

export const STOREFRONT_COLOR_MODE_STORAGE_PREFIX = "modenixos-storefront-mode:";

export function storefrontColorModeStorageKey(storeSlug: string) {
  return `${STOREFRONT_COLOR_MODE_STORAGE_PREFIX}${storeSlug}`;
}

export function readStoredColorMode(storeSlug: string): StorefrontColorMode | null {
  if (typeof window === "undefined" || !storeSlug) return null;
  const stored = localStorage.getItem(storefrontColorModeStorageKey(storeSlug));
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

export function getSystemColorMode(): StorefrontColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
