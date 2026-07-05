import type { StorefrontColorMode, StorefrontColorPalette } from "../types";
import { ensureForeground } from "./contrast";
import { adjustLightness, colorToHex, getLightness, withAlpha } from "./colorMath";
import { harmonizePalette } from "./harmonizePalette";

export interface BrandSeed {
  brandPrimary: string;
  brandAccent: string;
}

const SEMANTIC = {
  success: "#16a34a",
  destructive: "#dc2626",
  rating: "#f59e0b",
  ratingEmpty: "#d4d4d8",
} as const;

function generateLight(seed: BrandSeed): StorefrontColorPalette {
  const primary = colorToHex(seed.brandPrimary, "#171717");
  const accent = colorToHex(seed.brandAccent, primary);

  const background = "#fafafa";
  const surface = "#ffffff";
  const card = "#ffffff";
  const muted = "#f4f4f5";
  const navbar = "#ffffff";
  const footer = "#fafafa";
  const secondary = "#f4f4f5";

  const palette: StorefrontColorPalette = {
    background,
    foreground: ensureForeground(background),
    surface,
    surfaceForeground: ensureForeground(surface),
    muted,
    mutedForeground: ensureForeground(muted),
    border: "#e4e4e7",
    primary,
    primaryForeground: ensureForeground(primary),
    secondary,
    secondaryForeground: ensureForeground(secondary),
    accent,
    accentForeground: ensureForeground(accent),
    card,
    cardForeground: ensureForeground(card),
    heroOverlay: withAlpha("#000000", 0.45),
    announcement: primary,
    announcementForeground: ensureForeground(primary),
    navbar,
    navbarForeground: ensureForeground(navbar),
    footer,
    footerForeground: ensureForeground(footer),
    overlay: withAlpha("#000000", 0.5),
    imageOverlay: withAlpha("#000000", 0.55),
    imageOverlayForeground: "#fafafa",
    imageOverlayMuted: withAlpha("#fafafa", 0.75),
    success: SEMANTIC.success,
    destructive: SEMANTIC.destructive,
    rating: SEMANTIC.rating,
    ratingEmpty: SEMANTIC.ratingEmpty,
  };

  return harmonizePalette(palette);
}

function generateDark(seed: BrandSeed): StorefrontColorPalette {
  const brandPrimary = colorToHex(seed.brandPrimary, "#fafafa");
  const brandAccent = colorToHex(seed.brandAccent, brandPrimary);

  const primaryL = getLightness(brandPrimary);
  const primary =
    primaryL < 0.55 ? adjustLightness(brandPrimary, 0.78) : brandPrimary;
  const accent =
    getLightness(brandAccent) < 0.55
      ? adjustLightness(brandAccent, 0.72)
      : brandAccent;

  const background = "#0a0a0a";
  const surface = "#171717";
  const card = "#171717";
  const muted = "#262626";
  const navbar = "#0a0a0a";
  const footer = "#0a0a0a";
  const secondary = "#262626";

  const palette: StorefrontColorPalette = {
    background,
    foreground: ensureForeground(background),
    surface,
    surfaceForeground: ensureForeground(surface),
    muted,
    mutedForeground: ensureForeground(muted),
    border: "#404040",
    primary,
    primaryForeground: ensureForeground(primary),
    secondary,
    secondaryForeground: ensureForeground(secondary),
    accent,
    accentForeground: ensureForeground(accent),
    card,
    cardForeground: ensureForeground(card),
    heroOverlay: withAlpha("#000000", 0.6),
    announcement: primary,
    announcementForeground: ensureForeground(primary),
    navbar,
    navbarForeground: ensureForeground(navbar),
    footer,
    footerForeground: ensureForeground(footer),
    overlay: withAlpha("#000000", 0.65),
    imageOverlay: withAlpha("#000000", 0.65),
    imageOverlayForeground: "#fafafa",
    imageOverlayMuted: withAlpha("#fafafa", 0.7),
    success: "#22c55e",
    destructive: "#ef4444",
    rating: SEMANTIC.rating,
    ratingEmpty: "#52525b",
  };

  return harmonizePalette(palette);
}

export function generatePalette(
  mode: StorefrontColorMode,
  seed: BrandSeed,
): StorefrontColorPalette {
  return mode === "dark" ? generateDark(seed) : generateLight(seed);
}

export function generatePalettePair(seed: BrandSeed): {
  light: StorefrontColorPalette;
  dark: StorefrontColorPalette;
} {
  return {
    light: generatePalette("light", seed),
    dark: generatePalette("dark", seed),
  };
}

export function extractBrandSeed(
  light?: Partial<StorefrontColorPalette>,
  dark?: Partial<StorefrontColorPalette>,
): BrandSeed {
  return {
    brandPrimary: light?.primary ?? dark?.primary ?? "#171717",
    brandAccent: light?.accent ?? dark?.accent ?? light?.secondary ?? "#737373",
  };
}

export function regenerateFromBrand(seed: BrandSeed): {
  light: StorefrontColorPalette;
  dark: StorefrontColorPalette;
} {
  return generatePalettePair(seed);
}
