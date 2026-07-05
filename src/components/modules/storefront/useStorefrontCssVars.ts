"use client";

import { useMemo } from "react";
import { themeToCssVars } from "@/lib/storefront/cssVars";
import { useStorefrontTheme } from "./StorefrontThemeContext";

export function useStorefrontCssVars(): Record<string, string> {
  const { activeTheme } = useStorefrontTheme();
  return useMemo(
    () => themeToCssVars(activeTheme.colors, activeTheme.typography),
    [activeTheme],
  );
}
