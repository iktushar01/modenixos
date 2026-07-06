"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { revalidateStoreBrandingAction } from "@/actions/store.actions";
import { parseStorefrontTheme } from "@/lib/storefrontTheme";
import { uploadStoreBranding } from "@/lib/uploadStoreBranding";
import { ImageCropUpload } from "./ImageCropUpload";
import { HeroSlideItem, HeroSlidesUpload, buildHeroSlidesMeta } from "./HeroSlidesUpload";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";

const LOGO_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: undefined },
];

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === "object") {
    const ax = err as { response?: { data?: { message?: string } }; message?: string };
    if (ax.response?.data?.message) return ax.response.data.message;
    if (ax.message) return ax.message;
  }
  return "Failed to save branding";
}

export default function StoreBrandingPage() {
  const queryClient = useQueryClient();
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

  const hasPendingChanges = Boolean(logoFile || clearLogo || slidesDirty);

  useDashboardReady(!isLoading);

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
    if (!hasPendingChanges) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();

      if (logoFile) {
        if (logoFile.size === 0) {
          toast.error("Logo file is empty — try cropping again");
          return;
        }
        fd.append("logo", logoFile, logoFile.name);
      } else if (clearLogo) {
        fd.append("logo", "");
      }

      if (slidesDirty) {
        const { meta, files } = buildHeroSlidesMeta(heroSlides);
        fd.append("heroSlidesMeta", JSON.stringify(meta));
        for (const file of files) {
          if (file.size === 0) {
            toast.error("One of the hero images is empty — re-add that slide");
            return;
          }
          fd.append("heroSlides", file, file.name);
        }
      }

      const updated = await uploadStoreBranding(store.id, fd);

      if (logoFile && !updated.logo) {
        throw new Error("Logo upload did not save — please try again");
      }

      queryClient.setQueryData(["my-store"], updated);
      await revalidateStoreBrandingAction();

      toast.success("Branding saved");
      setLogoFile(null);
      setClearLogo(false);
      setSlidesDirty(false);
      await refetch();
    } catch (err) {
      console.error("Branding save failed:", err);
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branding"
        description="Crop your logo or hero slides, then click Save branding to upload."
        action={
          hasPendingChanges ? (
            <Badge variant="secondary" className="shrink-0">
              Unsaved changes
            </Badge>
          ) : undefined
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Crop your logo, then save. Appears in the storefront navbar and footer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageCropUpload
            label="Shop logo"
            defaultAspect={1}
            ratioOptions={LOGO_RATIOS}
            allowShapeSelection
            defaultShape="rectangle"
            existingUrl={clearLogo ? null : store?.logo}
            outputFileName="logo.jpg"
            previewClassName="aspect-square max-w-[160px]"
            onCroppedFile={(file) => {
              setLogoFile(file);
              if (file) setClearLogo(false);
            }}
            onClear={() => {
              setClearLogo(true);
              setLogoFile(null);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero slider</CardTitle>
          <CardDescription>
            Add multiple banner images. They auto-rotate on the storefront (images only).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HeroSlidesUpload slides={heroSlides} onChange={handleSlidesChange} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving || !hasPendingChanges}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save branding
      </Button>
    </div>
  );
}
