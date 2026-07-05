"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProductColorImageUploadProps {
  colors: string[];
  colorImages: Record<string, string>;
  colorNewFiles: Record<string, File>;
  onColorImagesChange: (map: Record<string, string>) => void;
  onColorNewFilesChange: (map: Record<string, File>) => void;
}

export function ProductColorImageUpload({
  colors,
  colorImages,
  colorNewFiles,
  onColorImagesChange,
  onColorNewFilesChange,
}: ProductColorImageUploadProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const newFilePreviews = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [color, file] of Object.entries(colorNewFiles)) {
      map[color] = URL.createObjectURL(file);
    }
    return map;
  }, [colorNewFiles]);

  useEffect(() => {
    return () => {
      Object.values(newFilePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFilePreviews]);

  const setFileForColor = (color: string, file: File | null) => {
    const next = { ...colorNewFiles };
    if (file) {
      next[color] = file;
    } else {
      delete next[color];
    }
    onColorNewFilesChange(next);
  };

  const removeColorImage = (color: string) => {
    setFileForColor(color, null);
    const next = { ...colorImages };
    delete next[color];
    onColorImagesChange(next);
  };

  const addFile = (color: string, file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileForColor(color, file);
  };

  if (colors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-sm font-medium">Add colors first</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Define colors in the Variants section below, then upload an image for each color here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Upload one image per color. The first color&apos;s image is used as the product cover.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {colors.map((color) => {
          const preview = newFilePreviews[color] ?? colorImages[color] ?? null;

          return (
            <div key={color} className="space-y-2 rounded-lg border p-3">
              <Label className="text-sm font-medium">{color}</Label>
              {!preview ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRefs.current[color]?.click()}
                  onKeyDown={(e) => e.key === "Enter" && inputRefs.current[color]?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs font-medium">Upload {color} image</p>
                  <input
                    ref={(el) => {
                      inputRefs.current[color] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addFile(color, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              ) : (
                <div className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <Image src={preview} alt={`${color} product`} fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => removeColorImage(color)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-1 right-1 h-7 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => inputRefs.current[color]?.click()}
                  >
                    Replace
                  </Button>
                  <input
                    ref={(el) => {
                      inputRefs.current[color] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addFile(color, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
