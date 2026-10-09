"use client";

import { ImageCropUpload } from "@/components/modules/store/ImageCropUpload";
import {
  STOREFRONT_CATEGORY_ASPECT,
  STOREFRONT_CATEGORY_RATIO,
} from "@/lib/storefront/imageAspects";

interface CategoryImageUploadProps {
  existingUrl: string | null;
  onExistingChange: (url: string | null) => void;
  onNewFileChange: (file: File | null) => void;
}

export function CategoryImageUpload({
  existingUrl,
  onExistingChange,
  onNewFileChange,
}: CategoryImageUploadProps) {
  return (
    <ImageCropUpload
      label="Category image"
      description="Crop to 4:5 — matches the categories grid on your storefront."
      defaultAspect={STOREFRONT_CATEGORY_ASPECT}
      ratioOptions={[STOREFRONT_CATEGORY_RATIO]}
      allowShapeSelection={false}
      defaultShape="rectangle"
      existingUrl={existingUrl}
      onCroppedFile={onNewFileChange}
      onClear={() => {
        onNewFileChange(null);
        onExistingChange(null);
      }}
      outputFileName="category.jpg"
      previewClassName="aspect-[4/5] max-w-[200px]"
      previewFit="cover"
      cropTitle="Crop category image (4:5)"
    />
  );
}
