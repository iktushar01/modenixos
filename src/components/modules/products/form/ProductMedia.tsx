"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductMediaSection, ProductImageMode } from "../ProductMediaSection";

interface ProductMediaProps {
  imageMode: ProductImageMode;
  onImageModeChange: (mode: ProductImageMode) => void;
  colors: string[];
  existingUrls: string[];
  onExistingChange: (urls: string[]) => void;
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  colorImages: Record<string, string>;
  onColorImagesChange: (map: Record<string, string>) => void;
  colorNewFiles: Record<string, File>;
  onColorNewFilesChange: (map: Record<string, File>) => void;
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  showColorMode: boolean;
}

export function ProductMedia({
  imageMode,
  onImageModeChange,
  colors,
  existingUrls,
  onExistingChange,
  newFiles,
  onNewFilesChange,
  colorImages,
  onColorImagesChange,
  colorNewFiles,
  onColorNewFilesChange,
  videoUrl,
  onVideoUrlChange,
  showColorMode,
}: ProductMediaProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>
          Thumbnail and gallery images. The first image is used as the storefront cover.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProductMediaSection
          mode={imageMode}
          onModeChange={onImageModeChange}
          colors={colors}
          existingUrls={existingUrls}
          onExistingChange={onExistingChange}
          newFiles={newFiles}
          onNewFilesChange={onNewFilesChange}
          colorImages={colorImages}
          onColorImagesChange={onColorImagesChange}
          colorNewFiles={colorNewFiles}
          onColorNewFilesChange={onColorNewFilesChange}
          showColorMode={showColorMode}
        />
        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor="videoUrl">Video link</Label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="Paste YouTube or Vimeo link"
          />
          <p className="text-xs text-muted-foreground">
            Optional product video shown on the storefront product page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
