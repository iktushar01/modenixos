"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { parseStorefrontTheme } from "@/lib/storefrontTheme";
import { ImageCropUpload } from "./ImageCropUpload";
import { HeroSlideItem, HeroSlidesUpload, buildHeroSlidesMeta } from "./HeroSlidesUpload";

const LOGO_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: undefined },
];

export default function StoreBrandingPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [clearLogo, setClearLogo] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([]);
  const [slidesDirty, setSlidesDirty] = useState(false);

  const existingHeroSlides = useMemo(() => {
    if (!store) return [];
    return parseStorefrontTheme(store).heroSlides;
  }, [store]);

  useEffect(() => {
    if (!store || slidesDirty) return;
    setHeroSlides(
      existingHeroSlides.map((url, i) => ({
        id: `existing-${i}-${url.slice(-8)}`,
        url,
        preview: url,
      })),
    );
  }, [store?.id, store?.updatedAt, existingHeroSlides, store, slidesDirty]);

  const handleSlidesChange = useCallback((slides: HeroSlideItem[]) => {
    setHeroSlides(slides);
    setSlidesDirty(true);
  }, []);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      const fd = new FormData();
      let hasChanges = false;

      if (logoFile) {
        fd.append("logo", logoFile);
        hasChanges = true;
      } else if (clearLogo) {
        fd.append("logo", "");
        hasChanges = true;
      }

      if (slidesDirty) {
        const { meta, files } = buildHeroSlidesMeta(heroSlides);
        fd.append("heroSlidesMeta", JSON.stringify(meta));
        files.forEach((file) => fd.append("heroSlides", file));
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info("No changes to save");
        return;
      }

      await updateStoreAction(store.id, fd);
      toast.success("Branding saved");
      setLogoFile(null);
      setClearLogo(false);
      setSlidesDirty(false);
      refetch();
    } catch {
      toast.error("Failed to save branding");
    } finally {
      setSaving(false);
    }
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
        title="Branding"
        description="Logo and hero slider for your storefront."
      />

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Pick aspect ratio, rectangle or circle crop, zoom and rotation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageCropUpload
            label="Shop logo"
            defaultAspect={1}
            ratioOptions={LOGO_RATIOS}
            allowShapeSelection
            defaultShape="rect"
            existingUrl={clearLogo ? null : store?.logo}
            outputFileName="logo.jpg"
            previewClassName="aspect-square max-w-[160px]"
            onCroppedFile={(file) => {
              setLogoFile(file);
              if (file) setClearLogo(false);
            }}
            onClear={() => setClearLogo(true)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero slider</CardTitle>
          <CardDescription>
            Multiple full-width images that auto-rotate — no text or buttons on the slider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeroSlidesUpload slides={heroSlides} onChange={handleSlidesChange} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save branding
      </Button>
    </div>
  );
}
