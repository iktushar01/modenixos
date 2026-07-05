"use client";

import { ImageCropUpload } from "@/components/modules/store/ImageCropUpload";
import {
  STOREFRONT_COLLECTION_ASPECT,
  STOREFRONT_COLLECTION_RATIO,
} from "@/lib/storefront/imageAspects";

interface CollectionImageUploadProps {
  existingUrl: string | null;
  onExistingChange: (url: string | null) => void;
  onNewFileChange: (file: File | null) => void;
}

export function CollectionImageUpload({
  existingUrl,
  onExistingChange,
  onNewFileChange,
}: CollectionImageUploadProps) {
  return (
    <ImageCropUpload
      label="Collection image"
      description="Crop to 3:4 — matches the collections carousel on your storefront."
      defaultAspect={STOREFRONT_COLLECTION_ASPECT}
      ratioOptions={[STOREFRONT_COLLECTION_RATIO]}
      allowShapeSelection={false}
      defaultShape="rectangle"
      existingUrl={existingUrl}
      onCroppedFile={onNewFileChange}
      onClear={() => {
        onNewFileChange(null);
        onExistingChange(null);
      }}
      outputFileName="collection.jpg"
      previewClassName="aspect-[3/4] max-w-[200px]"
      previewFit="cover"
      cropTitle="Crop collection image (3:4)"
    />
  );
}
