"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import {
  parseStorefrontTheme,
  buildThemePayload,
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
        typography: theme.typography ?? { ...DEFAULT_STOREFRONT_TYPOGRAPHY },
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
        typography: form.typography,
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
    <div className="space-y-6">
      <PageHeader
        title="Storefront appearance"
        description="Colors, homepage sections, and social links for your public shop."
      />

      <Card>
        <CardHeader>
          <CardTitle>Theme & colors</CardTitle>
          <CardDescription>
            Choose a preset or customize brand colors. Light and dark palettes stay harmonious automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Choose font pairings for your public shop. Headlines and body text update across the full storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoreTypographyEditor
            typography={form.typography}
            onTypographyChange={(typography) => setForm((prev) => ({ ...prev, typography }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promo bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
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
              placeholder="Free shipping on orders over $100"
              value={form.promoText}
              onChange={(e) => setForm({ ...form, promoText: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandStoryTitle">Title</Label>
            <Input
              id="brandStoryTitle"
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Homepage sections</CardTitle>
          <CardDescription>Toggle which sections appear on your storefront.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SECTION_LABELS) as Array<keyof StorefrontSections>).map((key) => (
            <div key={key} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <Label htmlFor={`section-${key}`}>{SECTION_LABELS[key]}</Label>
              <Switch
                id={`section-${key}`}
                checked={form.sections[key]}
                onCheckedChange={() => toggleSection(key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/..."
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              placeholder="https://x.com/..."
              value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/..."
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save appearance
      </Button>
    </div>
  );
}
