"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  cropToCanvas,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CropShape } from "@/lib/cropImage";

export type CropRatioOption = {
  label: string;
  value: number | undefined;
};

export const CROP_RATIO_PRESETS: CropRatioOption[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
];

interface CropEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  title?: string;
  defaultAspect?: number;
  ratioOptions?: CropRatioOption[];
  allowShapeSelection?: boolean;
  defaultShape?: CropShape;
  outputFileName: string;
  onComplete: (file: File) => void;
}

function isRatioActive(selected: number | undefined, option: number | undefined) {
  if (option === undefined) return selected === undefined;
  return selected === option;
}

function buildInitialCrop(
  width: number,
  height: number,
  aspect: number | undefined,
): Crop {
  if (aspect === undefined) {
    return centerCrop({ unit: "%", width: 80, height: 70 }, width, height);
  }
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
    width,
    height,
  );
}

async function exportCrop(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  rotation: number,
  shape: CropShape,
): Promise<Blob> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const naturalCrop: PixelCrop = {
    unit: "px",
    x: Math.round(pixelCrop.x * scaleX),
    y: Math.round(pixelCrop.y * scaleY),
    width: Math.round(pixelCrop.width * scaleX),
    height: Math.round(pixelCrop.height * scaleY),
  };

  const canvas = document.createElement("canvas");
  await cropToCanvas(image, canvas, naturalCrop, 1, rotation);

  if (shape === "round") {
    const roundCanvas = document.createElement("canvas");
    roundCanvas.width = canvas.width;
    roundCanvas.height = canvas.height;
    const ctx = roundCanvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) / 2,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(canvas, 0, 0);
    return canvasToBlob(roundCanvas);
  }

  return canvasToBlob(canvas);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/jpeg",
      0.92,
    );
  });
}

export function CropEditorDialog({
  open,
  onOpenChange,
  imageSrc,
  title = "Crop image",
  defaultAspect = 16 / 9,
  ratioOptions = CROP_RATIO_PRESETS,
  allowShapeSelection = true,
  defaultShape = "rect",
  outputFileName,
  onComplete,
}: CropEditorDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [shape, setShape] = useState<CropShape>(defaultShape);
  const [processing, setProcessing] = useState(false);

  const resetControls = useCallback(() => {
    setCrop(undefined);
    setPixelCrop(undefined);
    setRotation(0);
    setAspect(defaultAspect);
    setShape(defaultShape);
  }, [defaultAspect, defaultShape]);

  const handleOpenChange = (next: boolean) => {
    if (!next) resetControls();
    onOpenChange(next);
  };

  const initCropFromImage = useCallback(
    (width: number, height: number, ratio: number | undefined) => {
      const next = buildInitialCrop(width, height, ratio);
      setCrop(next);
      setPixelCrop(convertToPixelCrop(next, width, height));
    },
    [],
  );

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    initCropFromImage(width, height, aspect);
  };

  useEffect(() => {
    if (!open || !imgRef.current) return;
    const { width, height } = imgRef.current;
    if (width > 0 && height > 0) {
      initCropFromImage(width, height, aspect);
    }
  }, [aspect, open, initCropFromImage]);

  const applyCrop = async () => {
    if (!imgRef.current || !pixelCrop?.width || !pixelCrop?.height) return;
    setProcessing(true);
    try {
      const blob = await exportCrop(imgRef.current, pixelCrop, rotation, shape);
      const file = new File([blob], outputFileName, { type: blob.type });
      onComplete(file);
      handleOpenChange(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[420px] items-center justify-center overflow-auto rounded-lg bg-muted p-2">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              aspect={aspect}
              circularCrop={shape === "round"}
              ruleOfThirds
              keepSelection
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(px) => setPixelCrop(px)}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt=""
                onLoad={onImageLoad}
                className="max-h-[360px] w-auto max-w-full"
                style={{ display: "block" }}
              />
            </ReactCrop>
          )}
        </div>

        {aspect === undefined && (
          <p className="text-xs text-muted-foreground">
            Free crop — drag corners and edges to any size. Move the selection by dragging inside it.
          </p>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Aspect ratio</Label>
            <div className="flex flex-wrap gap-1.5">
              {ratioOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAspect(opt.value)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    isRatioActive(aspect, opt.value)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {allowShapeSelection && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Crop shape</Label>
              <div className="flex gap-1.5">
                {(["rect", "round"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={cn(
                      "rounded-md border px-3 py-1 text-xs font-medium capitalize transition-colors",
                      shape === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {s === "rect" ? "Rectangle" : "Circle"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Rotation</Label>
              <span className="text-xs text-muted-foreground">{rotation}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={applyCrop} disabled={processing || !pixelCrop}>
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
