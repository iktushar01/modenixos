"use client";

import { ProductImageUpload } from "./ProductImageUpload";
import { ProductColorImageUpload } from "./ProductColorImageUpload";
import { Button } from "@/components/ui/button";

export type ProductImageMode = "standard" | "color";

interface ProductMediaSectionProps {
  mode: ProductImageMode;
  onModeChange: (mode: ProductImageMode) => void;
  colors: string[];
  existingUrls: string[];
  onExistingChange: (urls: string[]) => void;
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  colorImages: Record<string, string>;
  onColorImagesChange: (map: Record<string, string>) => void;
  colorNewFiles: Record<string, File>;
  onColorNewFilesChange: (map: Record<string, File>) => void;
  showColorMode?: boolean;
}

export function ProductMediaSection({
  mode,
  onModeChange,
  colors,
  existingUrls,
  onExistingChange,
  newFiles,
  onNewFilesChange,
  colorImages,
  onColorImagesChange,
  colorNewFiles,
  onColorNewFilesChange,
  showColorMode = true,
}: ProductMediaSectionProps) {
  return (
    <div className="space-y-4">
      {showColorMode && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "standard" ? "default" : "outline"}
            onClick={() => onModeChange("standard")}
          >
            Standard gallery
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "color" ? "default" : "outline"}
            onClick={() => onModeChange("color")}
          >
            By color
          </Button>
        </div>
      )}

      {mode === "standard" || !showColorMode ? (
        <>
          <p className="text-xs text-muted-foreground">
            Upload multiple images. The first image is the storefront cover.
          </p>
          <ProductImageUpload
            existingUrls={existingUrls}
            onExistingChange={onExistingChange}
            newFiles={newFiles}
            onNewFilesChange={onNewFilesChange}
          />
        </>
      ) : (
        <ProductColorImageUpload
          colors={colors}
          colorImages={colorImages}
          colorNewFiles={colorNewFiles}
          onColorImagesChange={onColorImagesChange}
          onColorNewFilesChange={onColorNewFilesChange}
        />
      )}
    </div>
  );
}
