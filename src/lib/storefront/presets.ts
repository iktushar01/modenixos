import { StorefrontColorMode, StorefrontColorPalette, StorefrontPalettePreset } from "./types";

const ANNOUNCEMENT_DARK = { announcement: "#0f172a", announcementForeground: "#ffffff" };
const ANNOUNCEMENT_LIGHT = { announcement: "#0f172a", announcementForeground: "#ffffff" };

const EXTENDED_COLORS_LIGHT = {
  overlay: "rgba(0,0,0,0.55)",
  imageOverlay: "rgba(0,0,0,0.85)",
  imageOverlayForeground: "#ffffff",
  imageOverlayMuted: "rgba(255,255,255,0.45)",
  success: "#16a34a",
  destructive: "#dc2626",
  rating: "#0f172a",
  ratingEmpty: "#71717a",
};

const EXTENDED_COLORS_DARK = {
  overlay: "rgba(0,0,0,0.72)",
  imageOverlay: "rgba(0,0,0,0.88)",
  imageOverlayForeground: "#ffffff",
  imageOverlayMuted: "rgba(255,255,255,0.45)",
  success: "#4ade80",
  destructive: "#f87171",
  rating: "#38bdf8",
  ratingEmpty: "#a3a3a3",
};

const CLASSIC_BASE_LIGHT: StorefrontColorPalette = {
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
  ...EXTENDED_COLORS_LIGHT,
};

const CLASSIC_BASE_DARK: StorefrontColorPalette = {
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
  ...EXTENDED_COLORS_DARK,
};

/** Ensures palettes saved before extended tokens existed still resolve completely */
export function fillPaletteDefaults(
  palette: StorefrontColorPalette,
  mode: StorefrontColorMode,
): StorefrontColorPalette {
  const ext = mode === "dark" ? EXTENDED_COLORS_DARK : EXTENDED_COLORS_LIGHT;
  return {
    ...palette,
    overlay: palette.overlay ?? ext.overlay,
    imageOverlay: palette.imageOverlay ?? ext.imageOverlay,
    imageOverlayForeground: palette.imageOverlayForeground ?? ext.imageOverlayForeground,
    imageOverlayMuted: palette.imageOverlayMuted ?? ext.imageOverlayMuted,
    success: palette.success ?? ext.success,
    destructive: palette.destructive ?? ext.destructive,
    rating: palette.rating ?? palette.accent ?? ext.rating,
    ratingEmpty: palette.ratingEmpty ?? palette.mutedForeground ?? ext.ratingEmpty,
  };
}

/** Build a complete palette from classic base + overrides, with brand-aligned extended tokens */
export function buildPalette(
  mode: StorefrontColorMode,
  overrides: Partial<StorefrontColorPalette> = {},
): StorefrontColorPalette {
  const base = mode === "dark" ? CLASSIC_BASE_DARK : CLASSIC_BASE_LIGHT;
  const merged: StorefrontColorPalette = { ...base, ...overrides };
  return fillPaletteDefaults(
    {
      ...merged,
      rating: overrides.rating ?? merged.accent,
      ratingEmpty: overrides.ratingEmpty ?? merged.mutedForeground,
    },
    mode,
  );
}

function withAnnouncement(
  palette: StorefrontColorPalette,
  ann: typeof ANNOUNCEMENT_LIGHT,
): StorefrontColorPalette {
  return { ...palette, ...ann };
}

export const CLASSIC_RETAIL_LIGHT: StorefrontColorPalette = buildPalette("light", {});
export const CLASSIC_RETAIL_DARK: StorefrontColorPalette = buildPalette("dark", {});

export const THEME1_DARK_DEFAULT: StorefrontColorPalette = buildPalette("dark", {
  secondary: "#c9a962",
  accent: "#c9a962",
  secondaryForeground: "#0a0a0a",
  accentForeground: "#0a0a0a",
  navbar: "rgba(0,0,0,0.8)",
  footer: "rgba(0,0,0,0.4)",
});

export const THEME1_LIGHT_DEFAULT: StorefrontColorPalette = buildPalette("light", {
  secondary: "#b8860b",
  accent: "#b8860b",
});

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
      buildPalette("dark", {
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
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(THEME1_LIGHT_DEFAULT, ANNOUNCEMENT_LIGHT),
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    description: "Deep navy with ice blue accents",
    dark: withAnnouncement(
      buildPalette("dark", {
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
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      buildPalette("light", {
        background: "#f0f4ff",
        primary: "#1e3a5f",
        primaryForeground: "#ffffff",
        secondary: "#0284c7",
        secondaryForeground: "#ffffff",
        accent: "#0284c7",
        accentForeground: "#ffffff",
      }),
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "rose-noir",
    name: "Rose Noir",
    description: "Dark base with rose gold highlights",
    dark: withAnnouncement(
      buildPalette("dark", {
        background: "#120a0e",
        surface: "#1a1015",
        secondary: "#e94560",
        accent: "#e94560",
        secondaryForeground: "#ffffff",
        accentForeground: "#ffffff",
        navbar: "rgba(18,10,14,0.9)",
        footer: "rgba(18,10,14,0.6)",
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      buildPalette("light", {
        background: "#fff5f7",
        secondary: "#e94560",
        accent: "#e94560",
        accentForeground: "#ffffff",
        secondaryForeground: "#ffffff",
      }),
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy greens on dark charcoal",
    dark: withAnnouncement(
      buildPalette("dark", {
        background: "#0a0f0c",
        surface: "#111916",
        secondary: "#6ee7b7",
        accent: "#34d399",
        secondaryForeground: "#0a0f0c",
        accentForeground: "#0a0f0c",
        navbar: "rgba(10,15,12,0.9)",
        footer: "rgba(10,15,12,0.6)",
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      buildPalette("light", {
        background: "#f0fdf4",
        secondary: "#059669",
        accent: "#059669",
        accentForeground: "#ffffff",
        secondaryForeground: "#ffffff",
      }),
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    description: "Clean white storefront with charcoal accents",
    dark: withAnnouncement(
      buildPalette("dark", {
        background: "#18181b",
        primary: "#fafafa",
        secondary: "#52525b",
        accent: "#52525b",
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      buildPalette("light", {
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
      }),
      ANNOUNCEMENT_LIGHT,
    ),
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber tones on deep brown",
    dark: withAnnouncement(
      buildPalette("dark", {
        background: "#140e0a",
        surface: "#1c1410",
        secondary: "#f59e0b",
        accent: "#fb923c",
        secondaryForeground: "#140e0a",
        accentForeground: "#140e0a",
        navbar: "rgba(20,14,10,0.9)",
        footer: "rgba(20,14,10,0.6)",
      }),
      ANNOUNCEMENT_DARK,
    ),
    light: withAnnouncement(
      buildPalette("light", {
        background: "#fffbeb",
        secondary: "#d97706",
        accent: "#ea580c",
      }),
      ANNOUNCEMENT_LIGHT,
    ),
  },
];

export function getPresetById(id: string): StorefrontPalettePreset | undefined {
  return STOREFRONT_PALETTE_PRESETS.find((p) => p.id === id);
}

export function resolvePresetPalette(presetId: string, mode: StorefrontColorMode): StorefrontColorPalette {
  const preset = getPresetById(presetId) ?? STOREFRONT_PALETTE_PRESETS[0];
  const base = mode === "dark" ? preset.dark : preset.light;
  return mergePalette(base, undefined, mode);
}

export function mergePalette(
  base: StorefrontColorPalette,
  overrides?: Partial<StorefrontColorPalette>,
  mode?: StorefrontColorMode,
): StorefrontColorPalette {
  const merged = overrides ? { ...base, ...overrides } : { ...base };
  return mode ? fillPaletteDefaults(merged, mode) : merged;
}
