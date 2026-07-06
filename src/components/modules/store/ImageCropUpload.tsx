"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resolveImageForCrop } from "@/lib/resolveImageForCrop";
import { CropEditorDialog, CropRatioOption } from "./CropEditorDialog";
import { CropShape } from "@/lib/cropShapes";
import { cn } from "@/lib/utils";

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
  previewFit?: "cover" | "contain";
  dropzoneClassName?: string;
  allowRecrop?: boolean;
  cropTitle?: string;
}

export function ImageCropUpload({
  label,
  description,
  defaultAspect = 1,
  ratioOptions,
  allowShapeSelection = true,
  defaultShape = "rectangle",
  existingUrl,
  onCroppedFile,
  onClear,
  outputFileName,
  previewClassName,
  previewFit = "cover",
  dropzoneClassName,
  allowRecrop = true,
  cropTitle,
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [recropLoading, setRecropLoading] = useState(false);
  const sourceRef = useRef<string | null>(null);

  useEffect(() => {
    setPreview(existingUrl ?? null);
    if (!existingUrl) {
      sourceRef.current = null;
    }
  }, [existingUrl]);

  const openCrop = (src: string, keepSource = true) => {
    if (keepSource) {
      sourceRef.current = src;
    }
    setImageSrc(src);
    setCropOpen(true);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      openCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const applyCropped = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onCroppedFile(file);
    setImageSrc(null);
  };

  const startRecrop = async () => {
    if (!preview || !allowRecrop) return;
    setRecropLoading(true);
    try {
      const src = sourceRef.current ?? (await resolveImageForCrop(preview));
      if (!sourceRef.current) {
        sourceRef.current = src;
      }
      openCrop(src, false);
    } catch (err) {
      console.error("Recrop load failed:", err);
      toast.error("Could not load image for cropping — try uploading again");
    } finally {
      setRecropLoading(false);
    }
  };

  const remove = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    sourceRef.current = null;
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
          className={cn(
            "relative overflow-hidden rounded-lg border bg-muted",
            previewClassName ?? "aspect-[3/1] max-w-md",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className={cn(
              "h-full w-full",
              previewFit === "contain" ? "object-contain p-2" : "object-cover",
            )}
          />
        </div>
      ) : (
        <label
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/50",
            dropzoneClassName ?? previewClassName,
          )}
        >
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

      <div className="flex flex-wrap gap-2">
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
        {preview && allowRecrop && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecrop}
            disabled={recropLoading}
          >
            {recropLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="mr-2 h-4 w-4" />
            )}
            Adjust crop
          </Button>
        )}
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
        title={cropTitle ?? "Crop image"}
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
