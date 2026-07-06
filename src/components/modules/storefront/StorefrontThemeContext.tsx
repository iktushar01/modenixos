"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { StorefrontColorMode, StorefrontThemeConfig } from "@/lib/storefront";
import { useOptionalStorefront } from "@/components/modules/storefront/StorefrontContext";
import {
  persistStorefrontColorMode,
  readStoredColorMode,
  resolveStorefrontColorMode,
  subscribeStorefrontColorMode,
} from "@/lib/storefront/colorModeStorage";
import { resolveColorsForMode } from "@/lib/storefront/parseTheme";

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
  const storefront = useOptionalStorefront();
  const cookieMode = storefront?.initialColorMode ?? null;

  const getSnapshot = () =>
    resolveStorefrontColorMode(storeSlug, {
      cookieMode,
      themeDefault: theme.colorMode,
    });

  const colorMode = useSyncExternalStore(
    (onStoreChange) => subscribeStorefrontColorMode(storeSlug, onStoreChange),
    getSnapshot,
    () => resolveStorefrontColorMode(storeSlug, { cookieMode, themeDefault: theme.colorMode }),
  );

  useEffect(() => {
    const stored = readStoredColorMode(storeSlug);
    if (stored) {
      persistStorefrontColorMode(storeSlug, stored);
    }
  }, [storeSlug]);

  const toggleColorMode = useCallback(() => {
    const next: StorefrontColorMode = colorMode === "dark" ? "light" : "dark";
    persistStorefrontColorMode(storeSlug, next);
  }, [colorMode, storeSlug]);

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
