"use client";

import { useMemo } from "react";
import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { useStorefrontTheme } from "./StorefrontThemeContext";

export function useStorefrontCssVars(): Record<string, string> {
  const { activeTheme } = useStorefrontTheme();
  return useMemo(() => cssVarsToStyle(activeTheme.colors), [activeTheme]);
}
