import { Store } from "@/types/store.types";
import {
  DEFAULT_UTILITY_LINKS,
  StorefrontColorMode,
  StorefrontColorPalette,
  StorefrontHeaderConfig,
  StorefrontNavLink,
  StorefrontNavSource,
  StorefrontSections,
  StorefrontTemplateId,
  StorefrontThemeConfig,
} from "./types";
import { getPresetById, mergePalette, STOREFRONT_PALETTE_PRESETS } from "./presets";

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

function parseNavLinks(raw: unknown): StorefrontNavLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      label: String(item.label ?? ""),
      href: String(item.href ?? ""),
    }))
    .filter((item) => item.label && item.href);
}

function resolveHeader(raw: Record<string, unknown>, store: Store): StorefrontHeaderConfig {
  const headerRaw = (raw.header ?? {}) as Record<string, unknown>;
  const announcementRaw = (headerRaw.announcement ?? {}) as Record<string, unknown>;
  const promoText = (raw.promoText as string) ?? "";
  const promoEnabled = raw.promoEnabled !== false;

  const defaultAnnouncementText =
    (announcementRaw.text as string) || promoText || `Welcome to ${store.brandName}`;

  const utilityLinks = parseNavLinks(headerRaw.utilityLinks);
  const navItems = parseNavLinks(headerRaw.navItems);

  return {
    announcement: {
      enabled:
        announcementRaw.enabled !== undefined
          ? Boolean(announcementRaw.enabled)
          : promoEnabled && Boolean(defaultAnnouncementText),
      text: defaultAnnouncementText,
    },
    tagline: (headerRaw.tagline as string) ?? "",
    utilityLinks: utilityLinks.length > 0 ? utilityLinks : DEFAULT_UTILITY_LINKS,
    navItems,
    navSource: ((headerRaw.navSource as StorefrontNavSource) ?? "categories") as StorefrontNavSource,
    showSearch: headerRaw.showSearch !== false,
    showPhone: headerRaw.showPhone !== false,
  };
}

function resolveContact(raw: Record<string, unknown>): StorefrontThemeConfig["contact"] {
  const contactRaw = (raw.contact ?? {}) as Record<string, unknown>;
  return { phone: (contactRaw.phone as string) ?? "" };
}

function resolveLayout(raw: Record<string, unknown>): StorefrontThemeConfig["layout"] {
  const layoutRaw = (raw.layout ?? {}) as Record<string, unknown>;
  return {
    fullWidth: layoutRaw.fullWidth !== false,
    heroHeight: (layoutRaw.heroHeight as string) ?? "60vh",
  };
}

function resolveColors(raw: Record<string, unknown>, colorMode: StorefrontColorMode): StorefrontColorPalette {
  const presetId = (raw.palettePreset as string) ?? "classic-retail";
  const preset = getPresetById(presetId) ?? STOREFRONT_PALETTE_PRESETS[0];
  const base = colorMode === "dark" ? preset.dark : preset.light;

  if (presetId === "custom") {
    const customRoot = (raw.customColors ?? {}) as Partial<
      Record<StorefrontColorMode, Partial<StorefrontColorPalette>>
    >;
    return mergePalette(base, customRoot[colorMode] ?? {});
  }

  const legacyOverrides: Partial<StorefrontColorPalette> = {};
  const legacyPrimary = raw.primaryColor as string | undefined;
  const legacySecondary = raw.secondaryColor as string | undefined;
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

export function resolveStorefrontNavLinks(
  theme: StorefrontThemeConfig,
  storeSlug: string,
  categories: Array<{ name: string; slug: string }>,
): StorefrontNavLink[] {
  const base = `/store/${storeSlug}`;

  const manual = theme.header.navItems.map((item) => {
    if (item.href.startsWith("#")) return { label: item.label, href: `${base}${item.href}` };
    if (item.href.startsWith("/store/")) return { label: item.label, href: item.href };
    if (item.href.startsWith("/")) return { label: item.label, href: item.href.replace("/cart", `${base}/cart`) };
    return { label: item.label, href: `${base}/${item.href}` };
  });

  const categoryLinks = categories.map((cat) => ({
    label: cat.name.toUpperCase(),
    href: `${base}#shop?category=${encodeURIComponent(cat.slug)}`,
  }));

  if (theme.header.navSource === "manual") return manual;
  if (theme.header.navSource === "categories") return categoryLinks;
  return [...manual, ...categoryLinks];
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

  const colorMode = ((raw.colorMode as StorefrontColorMode) ?? "light") as StorefrontColorMode;
  const colors = resolveColors(raw, colorMode);

  return {
    templateId: ((raw.templateId as StorefrontTemplateId) ?? "theme1") as StorefrontTemplateId,
    colorMode,
    palettePreset: (raw.palettePreset as string) ?? "classic-retail",
    colors,
    customColors: raw.customColors as StorefrontThemeConfig["customColors"],
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    header: resolveHeader(raw, store),
    layout: resolveLayout(raw),
    contact: resolveContact(raw),
    heroSlides,
    heroHeadline: (raw.heroHeadline as string) ?? store.brandName,
    heroSubtext:
      (raw.heroSubtext as string) ?? store.description ?? "Curated fashion for the modern wardrobe.",
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
  templateId?: StorefrontTemplateId;
  colorMode?: StorefrontColorMode;
  palettePreset?: string;
  customColors?: StorefrontThemeConfig["customColors"];
  primaryColor?: string;
  secondaryColor?: string;
  header?: StorefrontHeaderConfig;
  layout?: StorefrontThemeConfig["layout"];
  contact?: StorefrontThemeConfig["contact"];
  heroHeadline?: string;
  heroSubtext?: string;
  promoText?: string;
  promoEnabled?: boolean;
  brandStoryTitle?: string;
  brandStoryContent?: string;
  newsletterEnabled?: boolean;
  sections?: StorefrontSections;
  social?: StorefrontThemeConfig["social"];
  existingTheme: Record<string, unknown>;
}): Record<string, unknown> {
  const out: Record<string, unknown> = { ...form.existingTheme };
  if (form.templateId !== undefined) out.templateId = form.templateId;
  if (form.colorMode !== undefined) out.colorMode = form.colorMode;
  if (form.palettePreset !== undefined) out.palettePreset = form.palettePreset;
  if (form.customColors !== undefined) out.customColors = form.customColors;
  if (form.primaryColor !== undefined) out.primaryColor = form.primaryColor;
  if (form.secondaryColor !== undefined) out.secondaryColor = form.secondaryColor;
  if (form.header !== undefined) out.header = form.header;
  if (form.layout !== undefined) out.layout = form.layout;
  if (form.contact !== undefined) out.contact = form.contact;
  if (form.heroHeadline !== undefined) out.heroHeadline = form.heroHeadline;
  if (form.heroSubtext !== undefined) out.heroSubtext = form.heroSubtext;
  if (form.promoText !== undefined) out.promoText = form.promoText;
  if (form.promoEnabled !== undefined) out.promoEnabled = form.promoEnabled;
  if (form.brandStoryTitle !== undefined) out.brandStoryTitle = form.brandStoryTitle;
  if (form.brandStoryContent !== undefined) out.brandStoryContent = form.brandStoryContent;
  if (form.newsletterEnabled !== undefined) out.newsletterEnabled = form.newsletterEnabled;
  if (form.sections !== undefined) out.sections = form.sections;
  if (form.social !== undefined) out.social = form.social;
  return out;
}
