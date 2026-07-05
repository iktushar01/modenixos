"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StorefrontColorMode, StorefrontThemeConfig } from "@/lib/storefront";
import { resolveColorsForMode } from "@/lib/storefront/parseTheme";

const STORAGE_PREFIX = "modenixos-storefront-mode:";

interface StorefrontThemeContextValue {
  colorMode: StorefrontColorMode;
  toggleColorMode: () => void;
  activeTheme: StorefrontThemeConfig;
}

const StorefrontThemeContext = createContext<StorefrontThemeContextValue | null>(null);

export function useStorefrontTheme() {
  const ctx = useContext(StorefrontThemeContext);
  if (!ctx) {
    throw new Error("useStorefrontTheme must be used within StorefrontThemeProvider");
  }
  return ctx;
}

interface StorefrontThemeProviderProps {
  theme: StorefrontThemeConfig;
  storeSlug: string;
  children: React.ReactNode;
}

export function StorefrontThemeProvider({ theme, storeSlug, children }: StorefrontThemeProviderProps) {
  const [colorMode, setColorMode] = useState<StorefrontColorMode>(theme.colorMode);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${storeSlug}`);
    if (stored === "light" || stored === "dark") {
      setColorMode(stored);
    }
  }, [storeSlug]);

  const toggleColorMode = useCallback(() => {
    setColorMode((prev) => {
      const next: StorefrontColorMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem(`${STORAGE_PREFIX}${storeSlug}`, next);
      return next;
    });
  }, [storeSlug]);

  const activeTheme = useMemo((): StorefrontThemeConfig => {
    const colors = resolveColorsForMode(theme, colorMode);
    return {
      ...theme,
      colorMode,
      colors,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
    };
  }, [theme, colorMode]);

  const value = useMemo(
    () => ({ colorMode, toggleColorMode, activeTheme }),
    [colorMode, toggleColorMode, activeTheme],
  );

  return <StorefrontThemeContext.Provider value={value}>{children}</StorefrontThemeContext.Provider>;
}
