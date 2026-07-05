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
  StorefrontColorMode,
  StorefrontColorPalette,
} from "@/lib/storefront";
import { StoreColorPaletteEditor } from "./StoreColorPaletteEditor";

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
  const [form, setForm] = useState({
    templateId: "theme1" as const,
    colorMode: "light" as StorefrontColorMode,
    palettePreset: "classic-retail",
    customColors: undefined as Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>> | undefined,
    heroHeadline: "",
    heroSubtext: "",
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
        customColors: theme.customColors,
        heroHeadline: theme.heroHeadline,
        heroSubtext: theme.heroSubtext,
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
    }
  }, [store]);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      const existing = (store.theme ?? {}) as Record<string, unknown>;
      const resolved = parseStorefrontTheme({
        ...store,
        theme: buildThemePayload({
          templateId: form.templateId,
          colorMode: form.colorMode,
          palettePreset: form.palettePreset,
          customColors: form.customColors,
          primaryColor: undefined,
          secondaryColor: undefined,
          heroHeadline: form.heroHeadline,
          heroSubtext: form.heroSubtext,
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
        }),
      });

      await updateStoreAction(store.id, {
        theme: buildThemePayload({
          templateId: form.templateId,
          colorMode: form.colorMode,
          palettePreset: form.palettePreset,
          customColors: form.customColors,
          primaryColor: resolved.colors.primary,
          secondaryColor: resolved.colors.secondary,
          heroHeadline: form.heroHeadline,
          heroSubtext: form.heroSubtext,
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
        }),
      });
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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Storefront appearance"
        description="Full color control, hero copy, sections, and social links for your public shop."
      />

      <Card>
        <CardHeader>
          <CardTitle>Theme & colors</CardTitle>
          <CardDescription>
            Choose a preset palette or build your own. Toggle light or dark mode for your storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoreColorPaletteEditor
            colorMode={form.colorMode}
            palettePreset={form.palettePreset}
            customColors={form.customColors}
            onColorModeChange={(colorMode) => setForm((prev) => ({ ...prev, colorMode }))}
            onPresetChange={(palettePreset) => setForm((prev) => ({ ...prev, palettePreset }))}
            onCustomColorsChange={(customColors) => setForm((prev) => ({ ...prev, customColors, palettePreset: "custom" }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroHeadline">Headline</Label>
            <Input
              id="heroHeadline"
              value={form.heroHeadline}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtext">Subtext</Label>
            <Textarea
              id="heroSubtext"
              rows={3}
              value={form.heroSubtext}
              onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
            />
          </div>
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
