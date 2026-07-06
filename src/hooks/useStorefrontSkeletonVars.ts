"use client";

import { useSyncExternalStore, useMemo } from "react";
import { useOptionalStorefront } from "@/components/modules/storefront/StorefrontContext";
import { storefrontFontFallbackStyle } from "@/components/modules/storefront/fonts";
import { themeToCssVars } from "@/lib/storefront/cssVars";
import {
  resolveStorefrontColorMode,
  subscribeStorefrontColorMode,
} from "@/lib/storefront/colorModeStorage";
import { parseStorefrontTheme, resolveColorsForMode } from "@/lib/storefront/parseTheme";
import { THEME1_DARK_DEFAULT, THEME1_LIGHT_DEFAULT } from "@/lib/storefront/presets";
import type { StorefrontColorMode } from "@/lib/storefront/types";

function resolveFallbackPalette(mode: StorefrontColorMode) {
  return mode === "dark" ? THEME1_DARK_DEFAULT : THEME1_LIGHT_DEFAULT;
}

export function useStorefrontSkeletonVars(): Record<string, string> {
  const ctx = useOptionalStorefront();
  const slug = ctx?.slug ?? "";
  const store = ctx?.store ?? null;
  const cookieMode = ctx?.initialColorMode ?? null;
  const themeDefault = store ? parseStorefrontTheme(store).colorMode : null;

  const getSnapshot = () =>
    resolveStorefrontColorMode(slug, { cookieMode, themeDefault });

  const colorMode = useSyncExternalStore(
    (onStoreChange) => subscribeStorefrontColorMode(slug, onStoreChange),
    getSnapshot,
    () =>
      resolveStorefrontColorMode(slug, {
        cookieMode,
        themeDefault: themeDefault ?? undefined,
      }),
  );

  return useMemo(() => {
    const colors = store
      ? resolveColorsForMode(parseStorefrontTheme(store), colorMode)
      : resolveFallbackPalette(colorMode);

    return {
      ...themeToCssVars(colors),
      ...storefrontFontFallbackStyle,
    };
  }, [store, colorMode]);
}
