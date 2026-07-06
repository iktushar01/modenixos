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
  preset: "custom",
  siteFont: "DM Sans",
  bodyFont: "DM Sans",
  displayFont: "DM Sans",
};

/** Recommended single fonts for the full storefront */
export const STOREFRONT_SITE_FONT_PRESETS: {
  id: string;
  name: string;
  font: StorefrontFontOption;
  description: string;
}[] = [
  { id: "dm-sans", name: "DM Sans", font: "DM Sans", description: "Clean and versatile" },
  { id: "inter", name: "Inter", font: "Inter", description: "Modern UI standard" },
  { id: "outfit", name: "Outfit", font: "Outfit", description: "Geometric minimal" },
  { id: "sora", name: "Sora", font: "Sora", description: "Soft contemporary" },
  { id: "manrope", name: "Manrope", font: "Manrope", description: "Friendly geometric" },
  { id: "montserrat", name: "Montserrat", font: "Montserrat", description: "Bold fashion feel" },
  { id: "raleway", name: "Raleway", font: "Raleway", description: "Elegant sans" },
  { id: "plus-jakarta", name: "Plus Jakarta Sans", font: "Plus Jakarta Sans", description: "Crisp and professional" },
  { id: "playfair", name: "Playfair Display", font: "Playfair Display", description: "Classic serif" },
  { id: "cormorant", name: "Cormorant Garamond", font: "Cormorant Garamond", description: "Editorial serif" },
  { id: "lora", name: "Lora", font: "Lora", description: "Readable serif" },
  { id: "fraunces", name: "Fraunces", font: "Fraunces", description: "Expressive display serif" },
];

export function getFontPresetById(id: string): StorefrontFontPreset | undefined {
  return STOREFRONT_FONT_PRESETS.find((preset) => preset.id === id);
}

/** Resolve the single site font from saved theme typography. */
export function getSiteFont(typography?: StorefrontTypography): string {
  const source = typography ?? DEFAULT_STOREFRONT_TYPOGRAPHY;

  if (source.siteFont?.trim()) {
    return source.siteFont.trim();
  }

  if (source.bodyFont && source.displayFont && source.bodyFont === source.displayFont) {
    return source.bodyFont;
  }

  if (source.preset === "custom") {
    return source.bodyFont ?? source.displayFont ?? DEFAULT_STOREFRONT_TYPOGRAPHY.siteFont!;
  }

  const preset = getFontPresetById(source.preset);
  if (preset) {
    return preset.bodyFont;
  }

  return DEFAULT_STOREFRONT_TYPOGRAPHY.siteFont!;
}

/** Build typography payload for a single site-wide font. */
export function buildSiteTypography(font: string): StorefrontTypography {
  const trimmed = font.trim();
  return {
    preset: "custom",
    siteFont: trimmed,
    bodyFont: trimmed,
    displayFont: trimmed,
  };
}

export function resolveTypography(typography?: StorefrontTypography): {
  bodyFont: string;
  displayFont: string;
} {
  const siteFont = getSiteFont(typography);
  return {
    bodyFont: siteFont,
    displayFont: siteFont,
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
