"use client";

import { ReactNode } from "react";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { cssVarsToStyle } from "@/lib/storefront/cssVars";
import { cn } from "@/lib/utils";

interface StorefrontThemeShellProps {
  theme: StorefrontThemeConfig;
  children: ReactNode;
  className?: string;
}

/** Applies full storefront color palette as CSS variables on the shop shell */
export function StorefrontThemeShell({ theme, children, className }: StorefrontThemeShellProps) {
  return (
    <div
      className={cn("storefront-theme min-h-screen", className)}
      style={cssVarsToStyle(theme.colors)}
      data-storefront-theme={theme.templateId}
      data-color-mode={theme.colorMode}
    >
      {children}
    </div>
  );
}
