export type StorefrontTemplateId = "theme1";
export type StorefrontColorMode = "light" | "dark";

/** Full storefront color tokens — mapped to CSS variables on the shop shell */
export interface StorefrontColorPalette {
  background: string;
  foreground: string;
  surface: string;
  surfaceForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  heroOverlay: string;
  navbar: string;
  navbarForeground: string;
  footer: string;
  footerForeground: string;
}

export interface StorefrontPalettePreset {
  id: string;
  name: string;
  description: string;
  dark: StorefrontColorPalette;
  light: StorefrontColorPalette;
}

export interface StorefrontSections {
  categories: boolean;
  collections: boolean;
  featured: boolean;
  trending: boolean;
  promo: boolean;
  brandStory: boolean;
  reviews: boolean;
  newsletter: boolean;
}

export interface StorefrontThemeConfig {
  templateId: StorefrontTemplateId;
  colorMode: StorefrontColorMode;
  palettePreset: string;
  /** Active resolved palette for current colorMode */
  colors: StorefrontColorPalette;
  /** Custom overrides when palettePreset === "custom" */
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  /** @deprecated use colors.primary — kept for backward compat */
  primaryColor: string;
  /** @deprecated use colors.secondary */
  secondaryColor: string;
  heroSlides: string[];
  heroHeadline: string;
  heroSubtext: string;
  promoText: string;
  promoEnabled: boolean;
  brandStoryTitle: string;
  brandStoryContent: string;
  brandStoryImage: string | null;
  newsletterEnabled: boolean;
  sections: StorefrontSections;
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export const STOREFRONT_COLOR_FIELDS: Array<{ key: keyof StorefrontColorPalette; label: string; group: string }> = [
  { key: "background", label: "Page background", group: "Base" },
  { key: "foreground", label: "Page text", group: "Base" },
  { key: "surface", label: "Surface", group: "Base" },
  { key: "surfaceForeground", label: "Surface text", group: "Base" },
  { key: "muted", label: "Muted background", group: "Base" },
  { key: "mutedForeground", label: "Muted text", group: "Base" },
  { key: "border", label: "Borders", group: "Base" },
  { key: "primary", label: "Primary", group: "Brand" },
  { key: "primaryForeground", label: "Primary text", group: "Brand" },
  { key: "secondary", label: "Secondary", group: "Brand" },
  { key: "secondaryForeground", label: "Secondary text", group: "Brand" },
  { key: "accent", label: "Accent", group: "Brand" },
  { key: "accentForeground", label: "Accent text", group: "Brand" },
  { key: "card", label: "Card background", group: "Components" },
  { key: "cardForeground", label: "Card text", group: "Components" },
  { key: "heroOverlay", label: "Hero overlay", group: "Components" },
  { key: "navbar", label: "Navbar background", group: "Layout" },
  { key: "navbarForeground", label: "Navbar text", group: "Layout" },
  { key: "footer", label: "Footer background", group: "Layout" },
  { key: "footerForeground", label: "Footer text", group: "Layout" },
];
