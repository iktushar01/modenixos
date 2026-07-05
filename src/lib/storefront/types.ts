export type StorefrontTemplateId = "theme1";
export type StorefrontColorMode = "light" | "dark";
export type StorefrontNavSource = "manual" | "categories" | "both";

export interface StorefrontNavLink {
  label: string;
  href: string;
}

export interface StorefrontHeaderConfig {
  announcement: { enabled: boolean; text: string };
  tagline: string;
  utilityLinks: StorefrontNavLink[];
  navItems: StorefrontNavLink[];
  navSource: StorefrontNavSource;
  showSearch: boolean;
  showPhone: boolean;
}

export interface StorefrontLayoutConfig {
  fullWidth: boolean;
  heroHeight: string;
}

export interface StorefrontContactConfig {
  phone: string;
}

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
  announcement: string;
  announcementForeground: string;
  navbar: string;
  navbarForeground: string;
  footer: string;
  footerForeground: string;
  overlay: string;
  imageOverlay: string;
  imageOverlayForeground: string;
  imageOverlayMuted: string;
  success: string;
  destructive: string;
  rating: string;
  ratingEmpty: string;
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

export interface StorefrontBrandColors {
  primary: string;
  accent: string;
}

export interface StorefrontThemeConfig {
  templateId: StorefrontTemplateId;
  colorMode: StorefrontColorMode;
  palettePreset: string;
  colors: StorefrontColorPalette;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  brandColors?: StorefrontBrandColors;
  primaryColor: string;
  secondaryColor: string;
  header: StorefrontHeaderConfig;
  layout: StorefrontLayoutConfig;
  contact: StorefrontContactConfig;
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

export const DEFAULT_UTILITY_LINKS: StorefrontNavLink[] = [
  { label: "Log In", href: "/account/login" },
  { label: "Register", href: "/account/register" },
  { label: "Cart", href: "/cart" },
];

export const STOREFRONT_COLOR_PAIRS: Array<{
  bg: keyof StorefrontColorPalette;
  fg: keyof StorefrontColorPalette;
  group: string;
  bgLabel: string;
  fgLabel: string;
  ui?: boolean;
}> = [
  { bg: "background", fg: "foreground", group: "Base", bgLabel: "Page background", fgLabel: "Page text" },
  { bg: "surface", fg: "surfaceForeground", group: "Base", bgLabel: "Surface", fgLabel: "Surface text" },
  { bg: "muted", fg: "mutedForeground", group: "Base", bgLabel: "Muted background", fgLabel: "Muted text", ui: true },
  { bg: "primary", fg: "primaryForeground", group: "Brand", bgLabel: "Primary", fgLabel: "Primary text" },
  { bg: "secondary", fg: "secondaryForeground", group: "Brand", bgLabel: "Secondary", fgLabel: "Secondary text" },
  { bg: "accent", fg: "accentForeground", group: "Brand", bgLabel: "Accent", fgLabel: "Accent text" },
  { bg: "card", fg: "cardForeground", group: "Layout", bgLabel: "Card background", fgLabel: "Card text" },
  { bg: "announcement", fg: "announcementForeground", group: "Layout", bgLabel: "Announcement bar", fgLabel: "Announcement text" },
  { bg: "navbar", fg: "navbarForeground", group: "Layout", bgLabel: "Header background", fgLabel: "Header text" },
  { bg: "footer", fg: "footerForeground", group: "Layout", bgLabel: "Footer background", fgLabel: "Footer text" },
];

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
  { key: "announcement", label: "Announcement bar", group: "Layout" },
  { key: "announcementForeground", label: "Announcement text", group: "Layout" },
  { key: "navbar", label: "Header background", group: "Layout" },
  { key: "navbarForeground", label: "Header text", group: "Layout" },
  { key: "footer", label: "Footer background", group: "Layout" },
  { key: "footerForeground", label: "Footer text", group: "Layout" },
  { key: "overlay", label: "Modal overlay", group: "Overlays" },
  { key: "imageOverlay", label: "Image card overlay", group: "Overlays" },
  { key: "imageOverlayForeground", label: "Image card text", group: "Overlays" },
  { key: "imageOverlayMuted", label: "Image card muted text", group: "Overlays" },
  { key: "success", label: "Success / discount", group: "Feedback" },
  { key: "destructive", label: "Destructive / remove", group: "Feedback" },
  { key: "rating", label: "Star rating (filled)", group: "Feedback" },
  { key: "ratingEmpty", label: "Star rating (empty)", group: "Feedback" },
];
