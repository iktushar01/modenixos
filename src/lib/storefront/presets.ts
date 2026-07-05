import { StorefrontColorMode, StorefrontColorPalette, StorefrontPalettePreset } from "./types";
import {
  generatePalettePair,
  harmonizePalette,
  type BrandSeed,
} from "./palette";
import { fillPaletteDefaults as _fillDefaults } from "./paletteDefaults";

export { fillPaletteDefaults } from "./paletteDefaults";

interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  seed: BrandSeed;
  lightTweaks?: Partial<StorefrontColorPalette>;
  darkTweaks?: Partial<StorefrontColorPalette>;
}

function buildPreset(def: PresetDefinition): StorefrontPalettePreset {
  const generated = generatePalettePair(def.seed);
  const light = harmonizePalette({ ...generated.light, ...def.lightTweaks });
  const dark = harmonizePalette({ ...generated.dark, ...def.darkTweaks });
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    light,
    dark,
  };
}

const PRESET_DEFINITIONS: PresetDefinition[] = [
  {
    id: "classic-retail",
    name: "Classic Retail",
    description: "Light storefront with charcoal accents",
    seed: { brandPrimary: "#0f172a", brandAccent: "#0f172a" },
    lightTweaks: {
      background: "#ffffff",
      border: "rgba(0,0,0,0.08)",
      heroOverlay: "rgba(0,0,0,0.05)",
      footer: "#f8fafc",
      rating: "#0f172a",
    },
    darkTweaks: {
      primary: "#f5f5f5",
      secondary: "#38bdf8",
      accent: "#38bdf8",
      surface: "#141414",
      card: "#111111",
      navbar: "#141414",
      heroOverlay: "rgba(0,0,0,0.35)",
      rating: "#38bdf8",
    },
  },
  {
    id: "luxury-dark",
    name: "Luxury Dark",
    description: "Black & gold fashion aesthetic",
    seed: { brandPrimary: "#18181b", brandAccent: "#c9a962" },
    lightTweaks: {
      secondary: "#b8860b",
      accent: "#b8860b",
    },
    darkTweaks: {
      secondary: "#c9a962",
      accent: "#c9a962",
      navbar: "rgba(0,0,0,0.8)",
      navbarForeground: "#ffffff",
      footer: "rgba(0,0,0,0.4)",
      footerForeground: "#ffffff",
    },
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    description: "Deep navy with ice blue accents",
    seed: { brandPrimary: "#1e3a5f", brandAccent: "#0284c7" },
    lightTweaks: {
      background: "#f0f4ff",
      secondary: "#0284c7",
      accent: "#0284c7",
    },
    darkTweaks: {
      background: "#0b0f1a",
      surface: "#111827",
      card: "#111827",
      muted: "#1e293b",
      primary: "#e2e8f0",
      secondary: "#38bdf8",
      accent: "#38bdf8",
      navbar: "rgba(11,15,26,0.9)",
      footer: "rgba(11,15,26,0.6)",
    },
  },
  {
    id: "rose-noir",
    name: "Rose Noir",
    description: "Dark base with rose gold highlights",
    seed: { brandPrimary: "#171717", brandAccent: "#e94560" },
    lightTweaks: {
      background: "#fff5f7",
      secondary: "#e94560",
      accent: "#e94560",
    },
    darkTweaks: {
      background: "#120a0e",
      surface: "#1a1015",
      navbar: "rgba(18,10,14,0.9)",
      footer: "rgba(18,10,14,0.6)",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Earthy greens on dark charcoal",
    seed: { brandPrimary: "#14532d", brandAccent: "#059669" },
    lightTweaks: {
      background: "#f0fdf4",
      secondary: "#059669",
      accent: "#059669",
    },
    darkTweaks: {
      background: "#0a0f0c",
      surface: "#111916",
      secondary: "#6ee7b7",
      accent: "#34d399",
      navbar: "rgba(10,15,12,0.9)",
      footer: "rgba(10,15,12,0.6)",
    },
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    description: "Clean white storefront with charcoal accents",
    seed: { brandPrimary: "#18181b", brandAccent: "#71717a" },
    lightTweaks: {
      background: "#ffffff",
      foreground: "#09090b",
      surface: "#fafafa",
      surfaceForeground: "#09090b",
      border: "rgba(0,0,0,0.06)",
      secondary: "#71717a",
      accent: "#18181b",
      cardForeground: "#09090b",
      heroOverlay: "rgba(0,0,0,0.08)",
      navbarForeground: "#09090b",
      footer: "#fafafa",
      footerForeground: "#09090b",
    },
    darkTweaks: {
      primary: "#fafafa",
      secondary: "#52525b",
      accent: "#52525b",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber tones on deep brown",
    seed: { brandPrimary: "#92400e", brandAccent: "#d97706" },
    lightTweaks: {
      background: "#fffbeb",
      secondary: "#d97706",
      accent: "#ea580c",
    },
    darkTweaks: {
      background: "#140e0a",
      surface: "#1c1410",
      secondary: "#f59e0b",
      accent: "#fb923c",
      navbar: "rgba(20,14,10,0.9)",
      footer: "rgba(20,14,10,0.6)",
    },
  },
];

export const STOREFRONT_PALETTE_PRESETS: StorefrontPalettePreset[] =
  PRESET_DEFINITIONS.map(buildPreset);

export const CLASSIC_RETAIL_LIGHT = STOREFRONT_PALETTE_PRESETS[0].light;
export const CLASSIC_RETAIL_DARK = STOREFRONT_PALETTE_PRESETS[0].dark;

export const THEME1_LIGHT_DEFAULT =
  getPresetById("luxury-dark")?.light ?? CLASSIC_RETAIL_LIGHT;
export const THEME1_DARK_DEFAULT =
  getPresetById("luxury-dark")?.dark ?? CLASSIC_RETAIL_DARK;

/** @deprecated Use generatePalette + harmonizePalette instead */
export function buildPalette(
  mode: StorefrontColorMode,
  overrides: Partial<StorefrontColorPalette> = {},
): StorefrontColorPalette {
  const base = mode === "dark" ? CLASSIC_RETAIL_DARK : CLASSIC_RETAIL_LIGHT;
  return mergePalette(base, overrides, mode);
}

export function getPresetById(id: string): StorefrontPalettePreset | undefined {
  return STOREFRONT_PALETTE_PRESETS.find((p) => p.id === id);
}

export function getPresetBrandSeed(presetId: string): BrandSeed {
  const def = PRESET_DEFINITIONS.find((p) => p.id === presetId);
  return def?.seed ?? PRESET_DEFINITIONS[0].seed;
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
  const filled = mode ? _fillDefaults(merged, mode) : merged;
  return mode ? harmonizePalette(filled) : filled;
}
