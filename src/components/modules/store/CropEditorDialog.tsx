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
import { toast } from "sonner";
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
import {
  CROP_SHAPE_GROUPS,
  CropShapeType,
  applyShapeMask,
  normalizeCropShape,
  shapeForcesSquareAspect,
  shapeNeedsTransparency,
  shapeSvgPathString,
  usesCircularCropPreview,
  type CropShape,
} from "@/lib/cropShapes";

export type CropRatioOption = {
  label: string;
  value: number | undefined;
};

export const CROP_RATIO_PRESETS: CropRatioOption[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
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

function ShapeOverlay({ shape }: { shape: CropShapeType }) {
  if (shape === "rectangle" || shape === "square" || usesCircularCropPreview(shape)) {
    return null;
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d={shapeSvgPathString(shape)}
        fill="rgba(0,0,0,0.15)"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

async function exportCrop(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  rotation: number,
  shape: CropShapeType,
): Promise<Blob> {
  // cropToCanvas expects crop coords in displayed image pixels and scales to natural size internally
  const canvas = document.createElement("canvas");
  await cropToCanvas(image, canvas, pixelCrop, 1, rotation);

  const masked = applyShapeMask(canvas, shape);
  const mimeType = shapeNeedsTransparency(shape) ? "image/png" : "image/jpeg";
  return canvasToBlob(masked, mimeType);
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      mimeType,
      mimeType === "image/jpeg" ? 0.92 : undefined,
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
  defaultShape = "rectangle",
  outputFileName,
  onComplete,
}: CropEditorDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [shape, setShape] = useState<CropShapeType>(normalizeCropShape(defaultShape));
  const [processing, setProcessing] = useState(false);

  const effectiveAspect = shapeForcesSquareAspect(shape) ? 1 : aspect;

  const resetControls = useCallback(() => {
    setCrop(undefined);
    setPixelCrop(undefined);
    setRotation(0);
    setAspect(defaultAspect);
    setShape(normalizeCropShape(defaultShape));
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
    initCropFromImage(width, height, effectiveAspect);
  };

  useEffect(() => {
    if (!open || !imgRef.current) return;
    const { width, height } = imgRef.current;
    if (width > 0 && height > 0) {
      initCropFromImage(width, height, effectiveAspect);
    }
  }, [effectiveAspect, open, initCropFromImage]);

  const selectShape = (next: CropShapeType) => {
    setShape(next);
    if (shapeForcesSquareAspect(next)) {
      setAspect(1);
    }
  };

  const applyCrop = async () => {
    const img = imgRef.current;
    if (!img || !crop) return;

    const px = convertToPixelCrop(crop, img.width, img.height);
    if (!px.width || !px.height) return;

    setProcessing(true);
    try {
      const blob = await exportCrop(img, px, rotation, shape);
      if (blob.size === 0) {
        toast.error("Crop produced an empty image — try again");
        return;
      }

      const baseName = outputFileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
      const ext = shapeNeedsTransparency(shape) ? "png" : "jpg";
      const file = new File([blob], `${baseName}.${ext}`, { type: blob.type });
      onComplete(file);
      handleOpenChange(false);
    } catch (err) {
      console.error("Crop export failed:", err);
      toast.error("Crop failed — the image could not be processed. Try re-uploading the file.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[380px] items-center justify-center overflow-auto rounded-lg bg-muted p-2">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              aspect={effectiveAspect}
              circularCrop={usesCircularCropPreview(shape)}
              ruleOfThirds
              keepSelection
              onChange={(pixelCrop, percentCrop) => {
                setCrop(percentCrop);
                setPixelCrop(pixelCrop);
              }}
              className="max-w-full"
              renderSelectionAddon={() => <ShapeOverlay shape={shape} />}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt=""
                crossOrigin={imageSrc?.startsWith("http") ? "anonymous" : undefined}
                onLoad={onImageLoad}
                className="max-h-[340px] w-auto max-w-full"
                style={{ display: "block" }}
              />
            </ReactCrop>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {effectiveAspect === undefined
            ? "Free crop — drag corners and edges. Shape mask is applied on export."
            : "Drag the selection box. Custom shapes clip to the selected area."}
        </p>

        <div className="space-y-4">
          {allowShapeSelection && (
            <div className="space-y-3">
              {CROP_SHAPE_GROUPS.map((group) => (
                <div key={group.title} className="space-y-2">
                  <Label className="text-xs font-medium">{group.title}</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {group.shapes.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectShape(opt.id)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          shape === opt.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ratioOptions.length > 1 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Aspect ratio</Label>
            <div className="flex flex-wrap gap-1.5">
              {ratioOptions.map((opt) => {
                const locked = shapeForcesSquareAspect(shape);
                const disabled = locked && opt.value !== 1;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setAspect(opt.value)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      disabled && "cursor-not-allowed opacity-40",
                      isRatioActive(effectiveAspect, opt.value)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {shapeForcesSquareAspect(shape) && (
              <p className="text-xs text-muted-foreground">Square / circle shapes lock to 1:1 ratio.</p>
            )}
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
