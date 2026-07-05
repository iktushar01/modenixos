"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, GripVertical, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resolveImageForCrop } from "@/lib/resolveImageForCrop";
import { CropEditorDialog } from "./CropEditorDialog";

export type HeroSlideItem = {
  id: string;
  url?: string;
  preview: string;
  file?: File;
  /** Full-resolution source kept for re-crop (original upload or fetched server image) */
  sourceDataUrl?: string;
};

interface HeroSlidesUploadProps {
  slides: HeroSlideItem[];
  onChange: (slides: HeroSlideItem[]) => void;
}

/** Hero slider supports only these aspect ratios */
export const HERO_SLIDE_RATIOS = [
  { label: "21:9", value: 21 / 9 },
  { label: "3:1", value: 3 },
] as const;

function newId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function revokePreviewIfBlob(preview: string) {
  if (preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }
}

export function HeroSlidesUpload({ slides, onChange }: HeroSlidesUploadProps) {
  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Stable ref so crop complete always knows which slide is being edited */
  const editingSlideIdRef = useRef<string | null>(null);
  /** Original file data URL for new uploads — used as re-crop source */
  const pendingSourceRef = useRef<string | null>(null);

  const handleFile = (file: File) => {
    editingSlideIdRef.current = null;
    setEditingSlideId(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      pendingSourceRef.current = dataUrl;
      setImageSrc(dataUrl);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const startEditSlide = async (slide: HeroSlideItem) => {
    editingSlideIdRef.current = slide.id;
    setEditingSlideId(slide.id);
    setLoadingEditId(slide.id);
    try {
      const src =
        slide.sourceDataUrl ?? (await resolveImageForCrop(slide.preview));
      pendingSourceRef.current = src;
      setImageSrc(src);
      setCropOpen(true);
    } catch (err) {
      console.error("Failed to load slide for edit:", err);
      toast.error("Could not load image for editing — try re-uploading the slide");
      editingSlideIdRef.current = null;
      setEditingSlideId(null);
    } finally {
      setLoadingEditId(null);
    }
  };

  const handleCropComplete = (file: File) => {
    const preview = URL.createObjectURL(file);
    const editId = editingSlideIdRef.current;
    const sourceDataUrl = pendingSourceRef.current ?? undefined;

    if (editId) {
      onChange(
        slides.map((slide) => {
          if (slide.id !== editId) return slide;
          revokePreviewIfBlob(slide.preview);
          return {
            ...slide,
            preview,
            file,
            sourceDataUrl: slide.sourceDataUrl ?? sourceDataUrl,
          };
        }),
      );
    } else {
      onChange([
        ...slides,
        { id: newId(), preview, file, sourceDataUrl },
      ]);
    }

    editingSlideIdRef.current = null;
    setEditingSlideId(null);
    pendingSourceRef.current = null;
    setImageSrc(null);
  };

  const handleCropOpenChange = (open: boolean) => {
    setCropOpen(open);
    if (!open) {
      editingSlideIdRef.current = null;
      setEditingSlideId(null);
      pendingSourceRef.current = null;
      setImageSrc(null);
    }
  };

  const removeSlide = (id: string) => {
    const slide = slides.find((s) => s.id === id);
    if (slide) revokePreviewIfBlob(slide.preview);
    onChange(slides.filter((s) => s.id !== id));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    const next = [...slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const isEditing = Boolean(editingSlideId);

  return (
    <div className="space-y-4">
      <div>
        <Label>Hero slider images</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload images at <strong>21:9</strong> or <strong>3:1</strong>. They auto-rotate on your storefront.
          Use <strong>Edit</strong> on any slide to re-crop.
        </p>
      </div>

      {slides.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <div key={slide.id} className="group relative overflow-hidden rounded-lg border bg-muted">
              <div className="relative aspect-[21/9]">
                <Image src={slide.preview} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0 || loadingEditId === slide.id}
                    onClick={() => moveSlide(index, -1)}
                    aria-label="Move slide left"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === slides.length - 1 || loadingEditId === slide.id}
                    onClick={() => moveSlide(index, 1)}
                    aria-label="Move slide right"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    disabled={loadingEditId === slide.id}
                    onClick={() => startEditSlide(slide)}
                    aria-label="Edit slide crop"
                  >
                    {loadingEditId === slide.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Pencil className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    disabled={loadingEditId === slide.id}
                    onClick={() => removeSlide(slide.id)}
                    aria-label="Remove slide"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-1 border-t px-2 py-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GripVertical className="h-3 w-3" />
                  Slide {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-xs md:hidden"
                  disabled={loadingEditId === slide.id}
                  onClick={() => startEditSlide(slide)}
                >
                  {loadingEditId === slide.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Pencil className="h-3 w-3" />
                  )}
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
        <Plus className="mb-1.5 h-6 w-6 text-muted-foreground" />
        <span className="text-sm font-medium">Add slide</span>
        <span className="mt-0.5 text-xs text-muted-foreground">21:9 or 3:1 ratio only</span>
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
        onOpenChange={handleCropOpenChange}
        imageSrc={imageSrc}
        title={isEditing ? "Edit hero slide" : "Crop hero slide"}
        defaultAspect={21 / 9}
        ratioOptions={[...HERO_SLIDE_RATIOS]}
        allowShapeSelection={false}
        defaultShape="rectangle"
        outputFileName={
          editingSlideId ? `hero-slide-${editingSlideId}.jpg` : `hero-slide-${Date.now()}.jpg`
        }
        onComplete={handleCropComplete}
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
