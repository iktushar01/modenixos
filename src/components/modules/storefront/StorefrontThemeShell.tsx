"use client";

import { ReactNode } from "react";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { themeToCssVars } from "@/lib/storefront/cssVars";
import { resolveTypography } from "@/lib/storefront/fontPresets";
import { cn } from "@/lib/utils";
import { StorefrontGoogleFonts } from "./StorefrontGoogleFonts";
import { StorefrontThemeProvider, useStorefrontTheme } from "./StorefrontThemeContext";

interface StorefrontThemeShellProps {
  theme: StorefrontThemeConfig;
  storeSlug: string;
  children: ReactNode;
  className?: string;
}

function StorefrontThemeShellInner({ children, className }: { children: ReactNode; className?: string }) {
  const { colorMode, activeTheme } = useStorefrontTheme();
  const fonts = resolveTypography(activeTheme.typography);

  return (
    <>
      <StorefrontGoogleFonts bodyFont={fonts.bodyFont} displayFont={fonts.displayFont} />
      <div
        className={cn("storefront-theme min-h-screen min-h-[100dvh] w-full max-w-[100vw]", className)}
        style={themeToCssVars(activeTheme.colors, activeTheme.typography)}
        data-storefront-theme={activeTheme.templateId}
        data-color-mode={colorMode}
      >
        {children}
      </div>
    </>
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
