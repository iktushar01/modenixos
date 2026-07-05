import { StorefrontColorPalette } from "./types";

/** Maps palette tokens to CSS custom properties on `.storefront-theme` */
export function paletteToCssVars(colors: StorefrontColorPalette): Record<string, string> {
  return {
    "--sf-bg": colors.background,
    "--sf-fg": colors.foreground,
    "--sf-surface": colors.surface,
    "--sf-surface-fg": colors.surfaceForeground,
    "--sf-muted": colors.muted,
    "--sf-muted-fg": colors.mutedForeground,
    "--sf-border": colors.border,
    "--sf-primary": colors.primary,
    "--sf-primary-fg": colors.primaryForeground,
    "--sf-secondary": colors.secondary,
    "--sf-secondary-fg": colors.secondaryForeground,
    "--sf-accent": colors.accent,
    "--sf-accent-fg": colors.accentForeground,
    "--sf-card": colors.card,
    "--sf-card-fg": colors.cardForeground,
    "--sf-hero-overlay": colors.heroOverlay,
    "--sf-announcement": colors.announcement,
    "--sf-announcement-fg": colors.announcementForeground,
    "--sf-navbar": colors.navbar,
    "--sf-navbar-fg": colors.navbarForeground,
    "--sf-footer": colors.footer,
    "--sf-footer-fg": colors.footerForeground,
    "--sf-overlay": colors.overlay,
    "--sf-image-overlay": colors.imageOverlay,
    "--sf-image-overlay-fg": colors.imageOverlayForeground,
    "--sf-image-overlay-muted": colors.imageOverlayMuted,
    "--sf-success": colors.success,
    "--sf-destructive": colors.destructive,
    "--sf-rating": colors.rating,
    "--sf-rating-empty": colors.ratingEmpty,
    // legacy aliases used by some components
    "--store-primary": colors.primary,
    "--store-secondary": colors.secondary,
  };
}

export function cssVarsToStyle(colors: StorefrontColorPalette): Record<string, string> {
  return paletteToCssVars(colors);
}
