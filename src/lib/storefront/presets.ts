import { StorefrontColorPalette, StorefrontPalettePreset } from "./types";

const ANNOUNCEMENT_DARK = { announcement: "#0f172a", announcementForeground: "#ffffff" };
const ANNOUNCEMENT_LIGHT = { announcement: "#0f172a", announcementForeground: "#ffffff" };

export const CLASSIC_RETAIL_LIGHT: StorefrontColorPalette = {
  background: "#ffffff",
  foreground: "#171717",
  surface: "#ffffff",
  surfaceForeground: "#171717",
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  border: "rgba(0,0,0,0.08)",
  primary: "#0f172a",
  primaryForeground: "#ffffff",
  secondary: "#0f172a",
  secondaryForeground: "#ffffff",
  accent: "#0f172a",
  accentForeground: "#ffffff",
  card: "#ffffff",
  cardForeground: "#171717",
  heroOverlay: "rgba(0,0,0,0.05)",
  ...ANNOUNCEMENT_LIGHT,
  navbar: "#ffffff",
  navbarForeground: "#171717",
  footer: "#f8fafc",
  footerForeground: "#171717",
};

export const CLASSIC_RETAIL_DARK: StorefrontColorPalette = {
  background: "#0a0a0a",
  foreground: "#f5f5f5",
  surface: "#141414",
  surfaceForeground: "#f5f5f5",
  muted: "#1a1a1a",
  mutedForeground: "#a3a3a3",
  border: "rgba(255,255,255,0.1)",
  primary: "#f5f5f5",
  primaryForeground: "#0a0a0a",
  secondary: "#38bdf8",
  secondaryForeground: "#0a0a0a",
  accent: "#38bdf8",
  accentForeground: "#0a0a0a",
  card: "#111111",
  cardForeground: "#f5f5f5",
  heroOverlay: "rgba(0,0,0,0.35)",
  ...ANNOUNCEMENT_DARK,
  navbar: "#141414",
  navbarForeground: "#f5f5f5",
  footer: "#0a0a0a",
  footerForeground: "#f5f5f5",
};

export const THEME1_DARK_DEFAULT: StorefrontColorPalette = {
  ...CLASSIC_RETAIL_DARK,
  secondary: "#c9a962",
  accent: "#c9a962",
  navbar: "rgba(0,0,0,0.8)",
  footer: "rgba(0,0,0,0.4)",
};

export const THEME1_LIGHT_DEFAULT: StorefrontColorPalette = {
  ...CLASSIC_RETAIL_LIGHT,
  secondary: "#b8860b",
  accent: "#b8860b",
};

function withAnnouncement(palette: StorefrontColorPalette, ann: typeof ANNOUNCEMENT_LIGHT): StorefrontColorPalette {
  return { ...palette, ...ann };
}

export const STOREFRONT_PALETTE_PRESETS: StorefrontPalettePreset[] = [
  {
    id: "classic-retail",
    name: "Classic Retail",
    description: "Light storefront with navy announcement bar",
    dark: CLASSIC_RETAIL_DARK,
    light: CLASSIC_RETAIL_LIGHT,
  },
  {
    id: "luxury-dark",
    name: "Luxury Dark",
    description: "Black & gold fashion aesthetic",
    dark: withAnnouncement(
      {
        background: "#0a0a0a",
        foreground: "#f5f5f5",
        surface: "#141414",
        surfaceForeground: "#f5f5f5",
        muted: "#1a1a1a",
        mutedForeground: "#a3a3a3",
        border: "rgba(255,255,255,0.1)",
        primary: "#f5f5f5",
        primaryForeground: "#0a0a0a",
        secondary: "#c9a962",
        secondaryForeground: "#0a0a0a",
        accent: "#c9a962",
        accentForeground: "#0a0a0a",
        card: "#111111",
        cardForeground: "#f5f5f5",
        heroOverlay: "rgba(0,0,0,0.35)",
        navbar: "rgba(0,0,0,0.8)",
        navbarForeground: "#ffffff",
        footer: "rgba(0,0,0,0.4)",
        footerForeground: "#ffffff",
      } as StorefrontColorPalette,
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(THEME1_LIGHT_DEFAULT, ANNOUNCEMENT_LIGHT),
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    description: "Deep navy with ice blue accents",
    dark: withAnnouncement(
      {
        ...CLASSIC_RETAIL_DARK,
        background: "#0b0f1a",
        surface: "#111827",
        muted: "#1e293b",
        primary: "#e2e8f0",
        primaryForeground: "#0b0f1a",
        secondary: "#38bdf8",
        secondaryForeground: "#0b0f1a",
        accent: "#38bdf8",
        accentForeground: "#0b0f1a",
        card: "#111827",
        navbar: "rgba(11,15,26,0.9)",
        footer: "rgba(11,15,26,0.6)",
      },
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      { ...CLASSIC_RETAIL_LIGHT, background: "#f0f4ff", primary: "#1e3a5f", secondary: "#0284c7", accent: "#0284c7" },
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "rose-noir",
    name: "Rose Noir",
    description: "Dark base with rose gold highlights",
    dark: withAnnouncement(
      {
        ...CLASSIC_RETAIL_DARK,
        background: "#120a0e",
        surface: "#1a1015",
        secondary: "#e94560",
        accent: "#e94560",
        secondaryForeground: "#ffffff",
        accentForeground: "#ffffff",
        navbar: "rgba(18,10,14,0.9)",
        footer: "rgba(18,10,14,0.6)",
      },
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      { ...CLASSIC_RETAIL_LIGHT, background: "#fff5f7", secondary: "#e94560", accent: "#e94560" },
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy greens on dark charcoal",
    dark: withAnnouncement(
      {
        ...CLASSIC_RETAIL_DARK,
        background: "#0a0f0c",
        surface: "#111916",
        secondary: "#6ee7b7",
        accent: "#34d399",
        secondaryForeground: "#0a0f0c",
        accentForeground: "#0a0f0c",
        navbar: "rgba(10,15,12,0.9)",
        footer: "rgba(10,15,12,0.6)",
      },
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      { ...CLASSIC_RETAIL_LIGHT, background: "#f0fdf4", secondary: "#059669", accent: "#059669" },
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    description: "Clean white storefront with charcoal accents",
    dark: withAnnouncement(
      { ...CLASSIC_RETAIL_DARK, background: "#18181b", primary: "#fafafa", secondary: "#52525b", accent: "#52525b" },
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      {
        background: "#ffffff",
        foreground: "#09090b",
        surface: "#fafafa",
        surfaceForeground: "#09090b",
        muted: "#f4f4f5",
        mutedForeground: "#71717a",
        border: "rgba(0,0,0,0.06)",
        primary: "#18181b",
        primaryForeground: "#fafafa",
        secondary: "#71717a",
        secondaryForeground: "#ffffff",
        accent: "#18181b",
        accentForeground: "#fafafa",
        card: "#ffffff",
        cardForeground: "#09090b",
        heroOverlay: "rgba(0,0,0,0.08)",
        navbar: "#ffffff",
        navbarForeground: "#09090b",
        footer: "#fafafa",
        footerForeground: "#09090b",
      } as StorefrontColorPalette,
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber tones on deep brown",
    dark: withAnnouncement(
      {
        ...CLASSIC_RETAIL_DARK,
        background: "#140e0a",
        surface: "#1c1410",
        secondary: "#f59e0b",
        accent: "#fb923c",
        secondaryForeground: "#140e0a",
        accentForeground: "#140e0a",
        navbar: "rgba(20,14,10,0.9)",
        footer: "rgba(20,14,10,0.6)",
      },
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      { ...CLASSIC_RETAIL_LIGHT, background: "#fffbeb", secondary: "#d97706", accent: "#ea580c" },
      ANNOUNCEMENT_LIGHT,
    ),
  },
];

export function getPresetById(id: string): StorefrontPalettePreset | undefined {
  return STOREFRONT_PALETTE_PRESETS.find((p) => p.id === id);
}

export function mergePalette(
  base: StorefrontColorPalette,
  overrides?: Partial<StorefrontColorPalette>,
): StorefrontColorPalette {
  if (!overrides) return { ...base };
  return { ...base, ...overrides };
}
