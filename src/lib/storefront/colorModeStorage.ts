import type { StorefrontColorMode } from "./types";

export const STOREFRONT_COLOR_MODE_STORAGE_PREFIX = "modenixos-storefront-mode:";
export const STOREFRONT_COLOR_MODE_COOKIE_PREFIX = "sf_color_mode_";
export const STOREFRONT_COLOR_MODE_CHANGE_EVENT = "storefront-color-mode-change";

export function storefrontColorModeStorageKey(storeSlug: string) {
  return `${STOREFRONT_COLOR_MODE_STORAGE_PREFIX}${storeSlug}`;
}

export function storefrontColorModeCookieName(storeSlug: string) {
  return `${STOREFRONT_COLOR_MODE_COOKIE_PREFIX}${storeSlug}`;
}

function isColorMode(value: string | undefined | null): value is StorefrontColorMode {
  return value === "light" || value === "dark";
}

export function readStoredColorMode(storeSlug: string): StorefrontColorMode | null {
  if (typeof window === "undefined" || !storeSlug) return null;
  const stored = localStorage.getItem(storefrontColorModeStorageKey(storeSlug));
  return isColorMode(stored) ? stored : null;
}

export function readColorModeFromDocumentCookie(storeSlug: string): StorefrontColorMode | null {
  if (typeof document === "undefined" || !storeSlug) return null;
  const prefix = `${storefrontColorModeCookieName(storeSlug)}=`;
  const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  const value = match?.slice(prefix.length);
  return isColorMode(value) ? value : null;
}

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

export function readColorModeFromCookie(
  cookieStore: CookieReader,
  storeSlug: string,
): StorefrontColorMode | null {
  if (!storeSlug) return null;
  const value = cookieStore.get(storefrontColorModeCookieName(storeSlug))?.value;
  return isColorMode(value) ? value : null;
}

export function getSystemColorMode(): StorefrontColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function persistStorefrontColorMode(storeSlug: string, mode: StorefrontColorMode) {
  if (typeof window === "undefined" || !storeSlug) return;
  localStorage.setItem(storefrontColorModeStorageKey(storeSlug), mode);
  document.cookie = `${storefrontColorModeCookieName(storeSlug)}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent(STOREFRONT_COLOR_MODE_CHANGE_EVENT, {
      detail: { slug: storeSlug, mode },
    }),
  );
}

export function subscribeStorefrontColorMode(storeSlug: string, onStoreChange: () => void) {
  if (typeof window === "undefined" || !storeSlug) return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === storefrontColorModeStorageKey(storeSlug)) onStoreChange();
  };

  const onCustom = (event: Event) => {
    const detail = (event as CustomEvent<{ slug?: string }>).detail;
    if (!detail?.slug || detail.slug === storeSlug) onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(STOREFRONT_COLOR_MODE_CHANGE_EVENT, onCustom);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STOREFRONT_COLOR_MODE_CHANGE_EVENT, onCustom);
  };
}

interface ResolveColorModeOptions {
  cookieMode?: StorefrontColorMode | null;
  themeDefault?: StorefrontColorMode | null;
}

/** User preference → cookie → theme default → system preference */
export function resolveStorefrontColorMode(
  storeSlug: string,
  options: ResolveColorModeOptions = {},
): StorefrontColorMode {
  const { cookieMode = null, themeDefault = null } = options;

  return (
    readStoredColorMode(storeSlug) ??
    cookieMode ??
    readColorModeFromDocumentCookie(storeSlug) ??
    themeDefault ??
    getSystemColorMode()
  );
}
