"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import {
  parseStorefrontTheme,
  buildThemePayload,
  buildSiteTypography,
  getSiteFont,
  StorefrontSections,
  StorefrontBrandColors,
  StorefrontColorMode,
  StorefrontColorPalette,
  StorefrontTypography,
  DEFAULT_STOREFRONT_TYPOGRAPHY,
  validatePalette,
  harmonizePalette,
  mergePalette,
  getPresetById,
  STOREFRONT_PALETTE_PRESETS,
} from "@/lib/storefront";
import { StoreColorPaletteEditor } from "./StoreColorPaletteEditor";
import { StoreTypographyEditor } from "./StoreTypographyEditor";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";

const SECTION_LABELS: Record<keyof StorefrontSections, string> = {
  categories: "Categories",
  collections: "Collections",
  featured: "Featured products",
  trending: "Trending scroll",
  promo: "Promo bar",
  brandStory: "Brand story",
  reviews: "Reviews",
  newsletter: "Newsletter",
};

export default function StoreAppearancePage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<StorefrontColorMode>("light");
  const [form, setForm] = useState({
    templateId: "theme1" as const,
    colorMode: "light" as StorefrontColorMode,
    palettePreset: "classic-retail",
    brandColors: { primary: "#0f172a", accent: "#0f172a" } as StorefrontBrandColors,
    customColors: undefined as Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>> | undefined,
    typography: { ...DEFAULT_STOREFRONT_TYPOGRAPHY } as StorefrontTypography,
    promoText: "",
    promoEnabled: true,
    brandStoryTitle: "",
    brandStoryContent: "",
    newsletterEnabled: true,
    instagram: "",
    twitter: "",
    facebook: "",
    sections: {} as StorefrontSections,
  });

  useEffect(() => {
    if (store) {
      const theme = parseStorefrontTheme(store);
      setForm({
        templateId: theme.templateId,
        colorMode: theme.colorMode,
        palettePreset: theme.palettePreset,
        brandColors: theme.brandColors ?? {
          primary: theme.primaryColor,
          accent: theme.secondaryColor,
        },
        customColors: theme.customColors,
        typography: buildSiteTypography(getSiteFont(theme.typography)),
        promoText: theme.promoText,
        promoEnabled: theme.promoEnabled,
        brandStoryTitle: theme.brandStoryTitle,
        brandStoryContent: theme.brandStoryContent,
        newsletterEnabled: theme.newsletterEnabled,
        instagram: theme.social.instagram ?? "",
        twitter: theme.social.twitter ?? "",
        facebook: theme.social.facebook ?? "",
        sections: theme.sections,
      });
      setPreviewMode(theme.colorMode);
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;

    let customColors = form.customColors;
    if (form.palettePreset === "custom" && customColors) {
      const preset = getPresetById("classic-retail") ?? STOREFRONT_PALETTE_PRESETS[0];
      const light = harmonizePalette(
        mergePalette(preset.light, customColors.light, "light"),
      );
      const dark = harmonizePalette(
        mergePalette(preset.dark, customColors.dark, "dark"),
      );
      const lightValidation = validatePalette(light);
      const darkValidation = validatePalette(dark);
      if (!lightValidation.ok || !darkValidation.ok) {
        toast.error("Fix contrast issues before saving, or use Auto-fix");
        return;
      }
      customColors = { light, dark };
    }

    setSaving(true);
    try {
      const existing = (store.theme ?? {}) as Record<string, unknown>;
      const themePayload = buildThemePayload({
        templateId: form.templateId,
        colorMode: form.colorMode,
        palettePreset: form.palettePreset,
        customColors,
        brandColors: form.brandColors,
        typography: buildSiteTypography(getSiteFont(form.typography)),
        promoText: form.promoText,
        promoEnabled: form.promoEnabled,
        brandStoryTitle: form.brandStoryTitle,
        brandStoryContent: form.brandStoryContent,
        newsletterEnabled: form.newsletterEnabled,
        sections: form.sections,
        social: {
          instagram: form.instagram || undefined,
          twitter: form.twitter || undefined,
          facebook: form.facebook || undefined,
        },
        existingTheme: existing,
      });

      await updateStoreAction(store.id, { theme: themePayload });
      toast.success("Storefront appearance saved");
      refetch();
    } catch {
      toast.error("Failed to save appearance");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: keyof StorefrontSections) => {
    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] },
    }));
  };

  if (isLoading) {
    return <DashboardFormSkeleton compact />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Storefront appearance"
        description="Colors, homepage sections, and social links for your public shop."
      />

      <StoreSection
        eyebrow="Colors"
        title="Colors & palette"
        description="Choose a preset or customize brand colors. Light and dark palettes stay harmonious automatically."
      >
        <StoreColorPaletteEditor
          defaultColorMode={form.colorMode}
          previewMode={previewMode}
          palettePreset={form.palettePreset}
          brandColors={form.brandColors}
          customColors={form.customColors}
          onDefaultColorModeChange={(colorMode) => setForm((prev) => ({ ...prev, colorMode }))}
          onPreviewModeChange={setPreviewMode}
          onPresetChange={(palettePreset) => setForm((prev) => ({ ...prev, palettePreset }))}
          onBrandColorsChange={(brandColors) => setForm((prev) => ({ ...prev, brandColors }))}
          onCustomColorsChange={(customColors) =>
            setForm((prev) => ({ ...prev, customColors, palettePreset: "custom" }))
          }
        />
      </StoreSection>

      <StoreSection
        eyebrow="Fonts"
        title="Store font"
        description="Choose one font for your entire public shop — every page, heading, and button uses it."
      >
        <StoreTypographyEditor
          typography={form.typography}
          onTypographyChange={(typography) => setForm((prev) => ({ ...prev, typography }))}
        />
      </StoreSection>

      <StoreSection eyebrow="Marketing" title="Promo bar">
        <div className="space-y-4">
          <div className="dashboard-toggle-row">
            <Label htmlFor="promoEnabled">Show promo bar</Label>
            <Switch
              id="promoEnabled"
              checked={form.promoEnabled}
              onCheckedChange={(v) => setForm({ ...form, promoEnabled: v })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promoText">Promo text</Label>
            <Input
              id="promoText"
              className="h-10"
              placeholder="Free shipping on orders over $100"
              value={form.promoText}
              onChange={(e) => setForm({ ...form, promoText: e.target.value })}
            />
          </div>
        </div>
      </StoreSection>

      <StoreSection eyebrow="Story" title="Brand story">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandStoryTitle">Title</Label>
            <Input
              id="brandStoryTitle"
              className="h-10"
              value={form.brandStoryTitle}
              onChange={(e) => setForm({ ...form, brandStoryTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandStoryContent">Content</Label>
            <Textarea
              id="brandStoryContent"
              rows={4}
              value={form.brandStoryContent}
              onChange={(e) => setForm({ ...form, brandStoryContent: e.target.value })}
              className="min-h-[120px] resize-y"
            />
          </div>
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="Layout"
        title="Homepage sections"
        description="Toggle which sections appear on your storefront."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SECTION_LABELS) as Array<keyof StorefrontSections>).map((key) => (
            <div key={key} className="dashboard-toggle-row py-3">
              <Label htmlFor={`section-${key}`}>{SECTION_LABELS[key]}</Label>
              <Switch
                id={`section-${key}`}
                checked={form.sections[key]}
                onCheckedChange={() => toggleSection(key)}
              />
            </div>
          ))}
        </div>
      </StoreSection>

      <StoreSection eyebrow="Social" title="Social links">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              className="h-10"
              placeholder="https://instagram.com/..."
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              className="h-10"
              placeholder="https://x.com/..."
              value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              className="h-10"
              placeholder="https://facebook.com/..."
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
          </div>
        </div>
      </StoreSection>

      <StoreSaveBar
        label="Save appearance"
        onSave={handleSave}
        saving={saving}
        hint="Updates colors, sections, and social links on your storefront."
      />
    </>
  );
}
