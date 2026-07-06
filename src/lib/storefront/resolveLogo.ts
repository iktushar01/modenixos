import { Store } from "@/types/store.types";
import { StorefrontColorMode, StorefrontLogoMode, StorefrontThemeConfig } from "./types";

export function getStoreLogoMode(
  theme: Pick<StorefrontThemeConfig, "branding"> | { branding?: { logoMode?: StorefrontLogoMode } },
): StorefrontLogoMode {
  return theme.branding?.logoMode === "dual" ? "dual" : "single";
}

/** Resolves which logo URL to show for the current storefront color mode. */
export function resolveStoreLogo(
  store: Pick<Store, "logo" | "logoDark" | "brandName">,
  theme: Pick<StorefrontThemeConfig, "branding">,
  colorMode: StorefrontColorMode,
): string | null {
  const primary = store.logo ?? null;
  if (!primary) return null;

  if (getStoreLogoMode(theme) === "dual" && colorMode === "dark") {
    return store.logoDark ?? primary;
  }

  return primary;
}
