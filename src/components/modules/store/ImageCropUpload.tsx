"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CropEditorDialog, CropRatioOption } from "./CropEditorDialog";
import { CropShape } from "@/lib/cropImage";

interface ImageCropUploadProps {
  label: string;
  description?: string;
  defaultAspect?: number;
  ratioOptions?: CropRatioOption[];
  allowShapeSelection?: boolean;
  defaultShape?: CropShape;
  existingUrl?: string | null;
  onCroppedFile: (file: File | null) => void;
  onClear?: () => void;
  outputFileName: string;
  previewClassName?: string;
}

export function ImageCropUpload({
  label,
  description,
  defaultAspect = 1,
  ratioOptions,
  allowShapeSelection = true,
  defaultShape = "rect",
  existingUrl,
  onCroppedFile,
  onClear,
  outputFileName,
  previewClassName,
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setPreview(existingUrl ?? null);
  }, [existingUrl]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const applyCropped = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onCroppedFile(file);
    setImageSrc(null);
  };

  const remove = () => {
    setPreview(null);
    onCroppedFile(null);
    onClear?.();
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>

      {preview ? (
        <div
          className={`relative overflow-hidden rounded-lg border bg-muted ${previewClassName ?? "aspect-[3/1] max-w-md"}`}
        >
          <Image src={preview} alt="" fill className="object-contain p-2" unoptimized />
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50">
          <Upload className="mb-2 h-7 w-7 text-muted-foreground" />
          <span className="text-sm font-medium">Upload image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}

      <div className="flex gap-2">
        <label>
          <Button type="button" variant="outline" size="sm" asChild>
            <span>{preview ? "Replace" : "Choose file"}</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
        {preview && (
          <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={remove}>
            Remove
          </Button>
        )}
      </div>

      <CropEditorDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={imageSrc}
        defaultAspect={defaultAspect}
        ratioOptions={ratioOptions}
        allowShapeSelection={allowShapeSelection}
        defaultShape={defaultShape}
        outputFileName={outputFileName}
        onComplete={applyCropped}
      />
    </div>
  );
}
