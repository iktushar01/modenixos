"use client";

import { useEffect, useMemo, useState } from "react";
import { useOptionalStorefront } from "@/components/modules/storefront/StorefrontContext";
import { storefrontFontFallbackStyle } from "@/components/modules/storefront/fonts";
import { themeToCssVars } from "@/lib/storefront/cssVars";
import {
  getSystemColorMode,
  readStoredColorMode,
} from "@/lib/storefront/colorModeStorage";
import { parseStorefrontTheme, resolveColorsForMode } from "@/lib/storefront/parseTheme";
import { CLASSIC_RETAIL_DARK, CLASSIC_RETAIL_LIGHT } from "@/lib/storefront/presets";
import type { StorefrontColorMode } from "@/lib/storefront/types";

function resolveInitialColorMode(slug: string): StorefrontColorMode {
  return readStoredColorMode(slug) ?? getSystemColorMode();
}

export function useStorefrontSkeletonVars(): Record<string, string> {
  const ctx = useOptionalStorefront();
  const slug = ctx?.slug ?? "";
  const store = ctx?.store ?? null;

  const [colorMode, setColorMode] = useState<StorefrontColorMode>(() =>
    slug ? resolveInitialColorMode(slug) : "light",
  );

  useEffect(() => {
    if (!slug) return;
    const stored = readStoredColorMode(slug);
    if (stored) {
      setColorMode(stored);
      return;
    }
    if (store) {
      setColorMode(parseStorefrontTheme(store).colorMode);
      return;
    }
    setColorMode(getSystemColorMode());
  }, [slug, store]);

  return useMemo(() => {
    const colors = store
      ? resolveColorsForMode(parseStorefrontTheme(store), colorMode)
      : colorMode === "dark"
        ? CLASSIC_RETAIL_DARK
        : CLASSIC_RETAIL_LIGHT;

    return {
      ...themeToCssVars(colors),
      ...storefrontFontFallbackStyle,
    };
  }, [store, colorMode]);
}
