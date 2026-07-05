import type { StorefrontTypography } from "./types";

export interface StorefrontFontPreset {
  id: string;
  name: string;
  description: string;
  bodyFont: string;
  displayFont: string;
}

/** Curated Google Fonts available in custom mode */
export const STOREFRONT_FONT_OPTIONS = [
  "DM Sans",
  "Inter",
  "Outfit",
  "Sora",
  "Manrope",
  "Montserrat",
  "Raleway",
  "Josefin Sans",
  "Plus Jakarta Sans",
  "Cormorant Garamond",
  "Playfair Display",
  "Lora",
  "Libre Baskerville",
  "Fraunces",
  "Cinzel",
] as const;

export type StorefrontFontOption = (typeof STOREFRONT_FONT_OPTIONS)[number];

export const STOREFRONT_FONT_PRESETS: StorefrontFontPreset[] = [
  {
    id: "editorial-classic",
    name: "Editorial Classic",
    description: "Serif headlines with a clean sans body",
    bodyFont: "DM Sans",
    displayFont: "Cormorant Garamond",
  },
  {
    id: "luxury-serif",
    name: "Luxury Serif",
    description: "Playfair display with refined body text",
    bodyFont: "Lora",
    displayFont: "Playfair Display",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Single-family geometric sans throughout",
    bodyFont: "Outfit",
    displayFont: "Outfit",
  },
  {
    id: "soft-contemporary",
    name: "Soft Contemporary",
    description: "Rounded sans with elegant contrast",
    bodyFont: "Sora",
    displayFont: "Fraunces",
  },
  {
    id: "urban-fashion",
    name: "Urban Fashion",
    description: "Bold condensed feel for streetwear brands",
    bodyFont: "Manrope",
    displayFont: "Josefin Sans",
  },
  {
    id: "timeless-boutique",
    name: "Timeless Boutique",
    description: "Classic serif pairing for heritage labels",
    bodyFont: "Raleway",
    displayFont: "Libre Baskerville",
  },
];

export const DEFAULT_STOREFRONT_TYPOGRAPHY: StorefrontTypography = {
  preset: "editorial-classic",
};

export function getFontPresetById(id: string): StorefrontFontPreset | undefined {
  return STOREFRONT_FONT_PRESETS.find((preset) => preset.id === id);
}

export function resolveTypography(typography?: StorefrontTypography): {
  bodyFont: string;
  displayFont: string;
} {
  const source = typography ?? DEFAULT_STOREFRONT_TYPOGRAPHY;

  if (source.preset === "custom") {
    const fallback = getFontPresetById("editorial-classic") ?? STOREFRONT_FONT_PRESETS[0];
    return {
      bodyFont: source.bodyFont ?? fallback.bodyFont,
      displayFont: source.displayFont ?? fallback.displayFont,
    };
  }

  const preset = getFontPresetById(source.preset) ?? STOREFRONT_FONT_PRESETS[0];
  return {
    bodyFont: preset.bodyFont,
    displayFont: preset.displayFont,
  };
}

function toGoogleFontParam(family: string): string {
  return `family=${family.trim().replace(/\s+/g, "+")}:wght@400;500;600;700`;
}

export function buildGoogleFontsHref(bodyFont: string, displayFont: string): string {
  return buildGoogleFontsHrefForFamilies([bodyFont, displayFont]);
}

export function buildGoogleFontsHrefForFamilies(families: string[]): string {
  const unique = [...new Set(families.map((family) => family.trim()).filter(Boolean))];
  const params = unique.map(toGoogleFontParam).join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export function typographyToCssVars(typography?: StorefrontTypography): Record<string, string> {
  const { bodyFont, displayFont } = resolveTypography(typography);
  return {
    "--sf-font-body": `"${bodyFont}"`,
    "--sf-font-display": `"${displayFont}"`,
  };
}
