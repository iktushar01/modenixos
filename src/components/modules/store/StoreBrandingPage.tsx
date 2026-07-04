"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyStore } from "@/hooks/useMyStore";
import { updateStoreAction } from "@/actions/store.actions";
import { ImageCropUpload } from "./ImageCropUpload";

export default function StoreBrandingPage() {
  const { data: store, refetch, isLoading } = useMyStore();
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [clearLogo, setClearLogo] = useState(false);
  const [clearBanner, setClearBanner] = useState(false);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    try {
      const fd = new FormData();
      if (logoFile) fd.append("logo", logoFile);
      else if (clearLogo) fd.append("logo", "");
      if (bannerFile) fd.append("banner", bannerFile);
      else if (clearBanner) fd.append("banner", "");

      if (!logoFile && !bannerFile && !clearLogo && !clearBanner) {
        toast.info("No changes to save");
        return;
      }

      await updateStoreAction(store.id, fd);
      toast.success("Branding saved");
      setLogoFile(null);
      setBannerFile(null);
      setClearLogo(false);
      setClearBanner(false);
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
        description="Upload your shop logo and hero banner. Logo appears in the navbar and footer."
      />

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Square or horizontal logo, shown in your storefront header and footer.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageCropUpload
            label="Shop logo"
            aspect={1}
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
          <CardTitle>Hero banner</CardTitle>
          <CardDescription>Wide image for your storefront hero section.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageCropUpload
            label="Hero banner"
            aspect={16 / 9}
            existingUrl={clearBanner ? null : store?.banner}
            outputFileName="banner.jpg"
            previewClassName="aspect-video max-w-xl"
            onCroppedFile={(file) => {
              setBannerFile(file);
              if (file) setClearBanner(false);
            }}
            onClear={() => setClearBanner(true)}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save branding
      </Button>
    </div>
  );
}
