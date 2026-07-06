"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sun } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { useMyStore } from "@/hooks/useMyStore";
import { revalidateStoreBrandingAction } from "@/actions/store.actions";
import { parseStorefrontTheme } from "@/lib/storefrontTheme";
import { StorefrontLogoMode } from "@/lib/storefront";
import { uploadStoreBranding } from "@/lib/uploadStoreBranding";
import { ImageCropUpload } from "./ImageCropUpload";
import { HeroSlideItem, HeroSlidesUpload, buildHeroSlidesMeta } from "./HeroSlidesUpload";
import { DashboardFormSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StoreSection } from "./StoreSection";
import { StoreSaveBar } from "./StoreSaveBar";
import { cn } from "@/lib/utils";

const LOGO_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: undefined },
];

const LOGO_UPLOAD_BOX = "aspect-square h-[140px] w-[140px] shrink-0";

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
  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [clearLogoDark, setClearLogoDark] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([]);
  const [slidesDirty, setSlidesDirty] = useState(false);

  const savedLogoMode = useMemo<StorefrontLogoMode>(() => {
    if (!store) return "single";
    return parseStorefrontTheme(store).branding.logoMode;
  }, [store]);

  const [logoMode, setLogoMode] = useState<StorefrontLogoMode>("single");

  useEffect(() => {
    if (store) setLogoMode(savedLogoMode);
  }, [store?.id, store?.updatedAt, savedLogoMode, store]);

  const existingHeroSlides = useMemo(() => {
    if (!store) return [];
    return parseStorefrontTheme(store).heroSlides;
  }, [store]);

  const logoModeDirty = logoMode !== savedLogoMode;

  const hasPendingChanges = Boolean(
    logoFile || clearLogo || logoDarkFile || clearLogoDark || slidesDirty || logoModeDirty,
  );

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

    if (logoMode === "dual" && !logoFile && !store.logo && !clearLogo) {
      toast.error("Upload a light mode logo first");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();

      fd.append("theme", JSON.stringify({ branding: { logoMode } }));

      if (logoFile) {
        if (logoFile.size === 0) {
          toast.error("Logo file is empty — try cropping again");
          return;
        }
        fd.append("logo", logoFile, logoFile.name);
      } else if (clearLogo) {
        fd.append("logo", "");
      }

      if (logoMode === "dual") {
        if (logoDarkFile) {
          if (logoDarkFile.size === 0) {
            toast.error("Dark logo file is empty — try cropping again");
            return;
          }
          fd.append("logoDark", logoDarkFile, logoDarkFile.name);
        } else if (clearLogoDark) {
          fd.append("logoDark", "");
        }
      } else if (store.logoDark || logoDarkFile) {
        fd.append("logoDark", "");
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
      setLogoDarkFile(null);
      setClearLogoDark(false);
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
    return <DashboardFormSkeleton compact />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Branding"
        description="Upload your shop logo for light and dark storefront themes, or use one logo for both."
        action={
          hasPendingChanges ? (
            <Badge variant="secondary" className="shrink-0">
              Unsaved changes
            </Badge>
          ) : undefined
        }
      />

      <StoreSection
        eyebrow="Identity"
        title="Logo"
        description="Choose one logo for all themes, or separate logos optimized for light and dark backgrounds."
      >
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Logo mode">
            <button
              type="button"
              role="radio"
              aria-checked={logoMode === "single"}
              onClick={() => setLogoMode("single")}
              className={cn(
                "rounded-lg border border-border p-4 text-left transition-colors",
                logoMode === "single" && "border-primary bg-primary/5 ring-1 ring-primary/20",
              )}
            >
              <p className="text-sm font-medium">One logo for all themes</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Same logo on light and dark storefront modes
              </p>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={logoMode === "dual"}
              onClick={() => setLogoMode("dual")}
              className={cn(
                "rounded-lg border border-border p-4 text-left transition-colors",
                logoMode === "dual" && "border-primary bg-primary/5 ring-1 ring-primary/20",
              )}
            >
              <p className="text-sm font-medium">Separate light &amp; dark logos</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Light logo for bright backgrounds, dark logo for dark mode
              </p>
            </button>
          </div>

          {logoMode === "single" ? (
            <ImageCropUpload
              label="Shop logo"
              description="Used in the navbar and footer on your storefront."
              defaultAspect={1}
              ratioOptions={LOGO_RATIOS}
              allowShapeSelection
              defaultShape="rectangle"
              existingUrl={clearLogo ? null : store?.logo}
              outputFileName="logo.jpg"
              previewClassName={LOGO_UPLOAD_BOX}
              dropzoneClassName={LOGO_UPLOAD_BOX}
              onCroppedFile={(file) => {
                setLogoFile(file);
                if (file) setClearLogo(false);
              }}
              onClear={() => {
                setClearLogo(true);
                setLogoFile(null);
              }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <ImageCropUpload
                  label="Light mode logo"
                  description="Shown on light backgrounds (default storefront theme)."
                  defaultAspect={1}
                  ratioOptions={LOGO_RATIOS}
                  allowShapeSelection
                  defaultShape="rectangle"
                  existingUrl={clearLogo ? null : store?.logo}
                  outputFileName="logo-light.jpg"
                  previewClassName={cn(LOGO_UPLOAD_BOX, "bg-white")}
                  dropzoneClassName={cn(LOGO_UPLOAD_BOX, "bg-white")}
                  previewFit="contain"
                  cropTitle="Crop light mode logo"
                  onCroppedFile={(file) => {
                    setLogoFile(file);
                    if (file) setClearLogo(false);
                  }}
                  onClear={() => {
                    setClearLogo(true);
                    setLogoFile(null);
                  }}
                />
              </div>
              <div className="rounded-lg border border-border p-4">
                <ImageCropUpload
                  label="Dark mode logo"
                  description="Shown when customers switch to dark mode. Often a lighter/white variant."
                  defaultAspect={1}
                  ratioOptions={LOGO_RATIOS}
                  allowShapeSelection
                  defaultShape="rectangle"
                  existingUrl={clearLogoDark ? null : store?.logoDark}
                  outputFileName="logo-dark.jpg"
                  previewClassName={cn(LOGO_UPLOAD_BOX, "bg-zinc-900")}
                  dropzoneClassName={cn(LOGO_UPLOAD_BOX, "bg-zinc-900 text-zinc-300")}
                  previewFit="contain"
                  cropTitle="Crop dark mode logo"
                  onCroppedFile={(file) => {
                    setLogoDarkFile(file);
                    if (file) setClearLogoDark(false);
                  }}
                  onClear={() => {
                    setClearLogoDark(true);
                    setLogoDarkFile(null);
                  }}
                />
              </div>
            </div>
          )}

          {logoMode === "dual" && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sun className="h-3.5 w-3.5" />
              Tip: use a dark logo on light backgrounds and a white or light logo for dark mode.
            </p>
          )}
        </div>
      </StoreSection>

      <StoreSection
        eyebrow="Homepage"
        title="Hero slider"
        description="Add multiple banner images. They auto-rotate on the storefront (images only)."
      >
        <HeroSlidesUpload slides={heroSlides} onChange={handleSlidesChange} />
      </StoreSection>

      <StoreSaveBar
        label="Save branding"
        onSave={handleSave}
        saving={saving}
        disabled={!hasPendingChanges}
        hint={hasPendingChanges ? "You have unsaved branding changes." : "Crop images above, then save to upload."}
      />
    </>
  );
}
