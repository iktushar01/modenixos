"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCroppedImageBlob } from "@/lib/cropImage";

interface ImageCropUploadProps {
  label: string;
  description?: string;
  aspect: number;
  existingUrl?: string | null;
  onCroppedFile: (file: File | null) => void;
  onClear?: () => void;
  outputFileName: string;
  previewClassName?: string;
}

export function ImageCropUpload({
  label,
  description,
  aspect,
  existingUrl,
  onCroppedFile,
  onClear,
  outputFileName,
  previewClassName,
}: ImageCropUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setPreview(existingUrl ?? null);
  }, [existingUrl]);

  const onCropComplete = useCallback((_: Area, area: Area) => {
    setCroppedArea(area);
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = async () => {
    if (!imageSrc || !croppedArea) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea);
      const file = new File([blob], outputFileName, { type: blob.type });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      onCroppedFile(file);
      setCropOpen(false);
      setImageSrc(null);
    } finally {
      setProcessing(false);
    }
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
        <div className={`relative overflow-hidden rounded-lg border bg-muted ${previewClassName ?? "aspect-[3/1] max-w-md"}`}>
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

      <Dialog open={cropOpen} onOpenChange={setCropOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="space-y-2 px-1">
            <Label className="text-xs">Zoom</Label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropOpen(false)}>Cancel</Button>
            <Button onClick={applyCrop} disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
