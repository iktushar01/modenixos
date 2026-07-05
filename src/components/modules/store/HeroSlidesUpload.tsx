"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, GripVertical, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CropEditorDialog } from "./CropEditorDialog";

export type HeroSlideItem = {
  id: string;
  url?: string;
  preview: string;
  file?: File;
};

interface HeroSlidesUploadProps {
  slides: HeroSlideItem[];
  onChange: (slides: HeroSlideItem[]) => void;
}

const HERO_RATIOS = [
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
  { label: "3:1", value: 3 },
  { label: "4:3", value: 4 / 3 },
  { label: "Free", value: undefined },
];

function newId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function HeroSlidesUpload({ slides, onChange }: HeroSlidesUploadProps) {
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const addCroppedSlide = (file: File) => {
    const preview = URL.createObjectURL(file);
    onChange([...slides, { id: newId(), preview, file }]);
    setImageSrc(null);
  };

  const removeSlide = (id: string) => {
    onChange(slides.filter((s) => s.id !== id));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    const next = [...slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Hero slider images</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload multiple images. They auto-rotate on your storefront — images only, no text overlay.
        </p>
      </div>

      {slides.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <div key={slide.id} className="group relative overflow-hidden rounded-lg border bg-muted">
              <div className="relative aspect-video">
                <Image src={slide.preview} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => moveSlide(index, -1)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === slides.length - 1}
                    onClick={() => moveSlide(index, 1)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeSlide(slide.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-1 border-t px-2 py-1.5 text-xs text-muted-foreground">
                <GripVertical className="h-3 w-3" />
                Slide {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
        <Plus className="mb-1.5 h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-medium">Add slide</span>
        <span className="mt-0.5 text-xs text-muted-foreground">Crop with ratio & rotation controls</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </label>

      {slides.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 shrink-0" />
          No slides yet — add at least one image for the hero slider.
        </div>
      )}

      <CropEditorDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={imageSrc}
        title="Crop hero slide"
        defaultAspect={16 / 9}
        ratioOptions={HERO_RATIOS}
        allowShapeSelection={false}
        defaultShape="rectangle"
        outputFileName={`hero-slide-${Date.now()}.jpg`}
        onComplete={addCroppedSlide}
      />
    </div>
  );
}

export function buildHeroSlidesMeta(slides: HeroSlideItem[]) {
  const files: File[] = [];
  const meta: Array<{ existing?: string; fileIndex?: number }> = [];

  for (const slide of slides) {
    if (slide.file) {
      meta.push({ fileIndex: files.length });
      files.push(slide.file);
    } else if (slide.url) {
      meta.push({ existing: slide.url });
    }
  }

  return { meta, files };
}
