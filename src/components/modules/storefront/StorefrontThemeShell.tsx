"use client";

import { ReactNode } from "react";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { cn } from "@/lib/utils";
import { StorefrontThemeProvider, useStorefrontTheme } from "./StorefrontThemeContext";

interface StorefrontThemeShellProps {
  theme: StorefrontThemeConfig;
  storeSlug: string;
  children: ReactNode;
  className?: string;
}

function StorefrontThemeShellInner({ children, className }: { children: ReactNode; className?: string }) {
  const { colorMode, activeTheme } = useStorefrontTheme();

  return (
    <div
      className={cn("storefront-theme min-h-screen", className)}
      style={cssVarsToStyle(activeTheme.colors)}
      data-storefront-theme={activeTheme.templateId}
      data-color-mode={colorMode}
    >
      {children}
    </div>
  );
}

/** Applies full storefront color palette as CSS variables on the shop shell */
export function StorefrontThemeShell({ theme, storeSlug, children, className }: StorefrontThemeShellProps) {
  return (
    <StorefrontThemeProvider theme={theme} storeSlug={storeSlug}>
      <StorefrontThemeShellInner className={className}>{children}</StorefrontThemeShellInner>
    </StorefrontThemeProvider>
  );
}

export { useStorefrontTheme } from "./StorefrontThemeContext";
