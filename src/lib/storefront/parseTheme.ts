import { Store } from "@/types/store.types";
import {
  StorefrontColorMode,
  StorefrontColorPalette,
  StorefrontSections,
  StorefrontTemplateId,
  StorefrontThemeConfig,
} from "./types";
import {
  THEME1_DARK_DEFAULT,
  getPresetById,
  mergePalette,
  STOREFRONT_PALETTE_PRESETS,
} from "./presets";

const defaultSections: StorefrontSections = {
  categories: true,
  collections: true,
  featured: true,
  trending: true,
  promo: true,
  brandStory: true,
  reviews: true,
  newsletter: true,
};

function resolveColors(
  raw: Record<string, unknown>,
  colorMode: StorefrontColorMode,
): StorefrontColorPalette {
  const presetId = (raw.palettePreset as string) ?? "luxury-dark";
  const preset = getPresetById(presetId) ?? STOREFRONT_PALETTE_PRESETS[0];
  const base = colorMode === "dark" ? preset.dark : preset.light;

  if (presetId === "custom") {
    const customRoot = (raw.customColors ?? {}) as Partial<
      Record<StorefrontColorMode, Partial<StorefrontColorPalette>>
    >;
    const modeOverrides = customRoot[colorMode] ?? {};
    return mergePalette(base, modeOverrides);
  }

  // Legacy: only primaryColor/secondaryColor saved — merge into preset
  const legacyPrimary = raw.primaryColor as string | undefined;
  const legacySecondary = raw.secondaryColor as string | undefined;
  const legacyOverrides: Partial<StorefrontColorPalette> = {};
  if (legacyPrimary) {
    legacyOverrides.primary = legacyPrimary;
    legacyOverrides.primaryForeground = colorMode === "dark" ? "#0a0a0a" : "#fafafa";
  }
  if (legacySecondary) {
    legacyOverrides.secondary = legacySecondary;
    legacyOverrides.accent = legacySecondary;
  }

  return mergePalette(base, legacyOverrides);
}

export function parseStorefrontTheme(store: Store): StorefrontThemeConfig {
  const raw = (store.theme ?? {}) as Record<string, unknown>;
  const sectionsRaw = (raw.sections ?? {}) as Partial<StorefrontSections>;
  const social = (raw.social ?? {}) as StorefrontThemeConfig["social"];
  const heroSlidesRaw = raw.heroSlides as string[] | undefined;
  const heroSlides =
    Array.isArray(heroSlidesRaw) && heroSlidesRaw.length > 0
      ? heroSlidesRaw
      : store.banner
        ? [store.banner]
        : [];

  const templateId = ((raw.templateId as StorefrontTemplateId) ?? "theme1") as StorefrontTemplateId;
  const colorMode = ((raw.colorMode as StorefrontColorMode) ?? "dark") as StorefrontColorMode;
  const palettePreset = (raw.palettePreset as string) ?? "luxury-dark";
  const colors = resolveColors(raw, colorMode);

  return {
    templateId,
    colorMode,
    palettePreset,
    colors,
    customColors: raw.customColors as StorefrontThemeConfig["customColors"],
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    heroSlides,
    heroHeadline: (raw.heroHeadline as string) ?? store.brandName,
    heroSubtext:
      (raw.heroSubtext as string) ??
      store.description ??
      "Curated fashion for the modern wardrobe.",
    promoText: (raw.promoText as string) ?? "",
    promoEnabled: raw.promoEnabled !== false,
    brandStoryTitle: (raw.brandStoryTitle as string) ?? `The ${store.brandName} Story`,
    brandStoryContent:
      (raw.brandStoryContent as string) ??
      store.description ??
      "Crafted with intention. Designed for those who appreciate quality, detail, and timeless style.",
    brandStoryImage: (raw.brandStoryImage as string) ?? store.banner ?? null,
    newsletterEnabled: raw.newsletterEnabled !== false,
    sections: { ...defaultSections, ...sectionsRaw },
    social,
  };
}

export function buildThemePayload(form: {
  templateId: StorefrontTemplateId;
  colorMode: StorefrontColorMode;
  palettePreset: string;
  customColors?: StorefrontThemeConfig["customColors"];
  primaryColor?: string;
  secondaryColor?: string;
  heroHeadline: string;
  heroSubtext: string;
  promoText: string;
  promoEnabled: boolean;
  brandStoryTitle: string;
  brandStoryContent: string;
  newsletterEnabled: boolean;
  sections: StorefrontSections;
  social: StorefrontThemeConfig["social"];
  existingTheme: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    ...form.existingTheme,
    templateId: form.templateId,
    colorMode: form.colorMode,
    palettePreset: form.palettePreset,
    customColors: form.customColors,
    primaryColor: form.primaryColor,
    secondaryColor: form.secondaryColor,
    heroHeadline: form.heroHeadline,
    heroSubtext: form.heroSubtext,
    promoText: form.promoText,
    promoEnabled: form.promoEnabled,
    brandStoryTitle: form.brandStoryTitle,
    brandStoryContent: form.brandStoryContent,
    newsletterEnabled: form.newsletterEnabled,
    sections: form.sections,
    social: form.social,
  };
}

export { THEME1_DARK_DEFAULT };
