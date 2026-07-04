"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MAX_IMAGES = 10;

interface ProductImageUploadProps {
  existingUrls: string[];
  onExistingChange: (urls: string[]) => void;
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
}

export function ProductImageUpload({
  existingUrls,
  onExistingChange,
  newFiles,
  onNewFilesChange,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const totalCount = existingUrls.length + newFiles.length;
  const canAddMore = totalCount < MAX_IMAGES;

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const allowed = incoming.slice(0, MAX_IMAGES - totalCount);
    if (allowed.length) onNewFilesChange([...newFiles, ...allowed]);
  };

  const removeNewFile = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Product images ({totalCount}/{MAX_IMAGES})</Label>

      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop images here</p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse (PNG, JPG, WebP)</p>
          <Button type="button" variant="outline" size="sm" className="mt-3 gap-1">
            <ImagePlus className="h-4 w-4" />
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>
      )}

      {(existingUrls.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {existingUrls.map((url, i) => (
            <div key={`existing-${url}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image src={url} alt={`Product ${i + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onExistingChange(existingUrls.filter((u) => u !== url))}
                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && existingUrls.length > 0 && newFiles.length === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Cover</span>
              )}
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div key={`new-${file.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && existingUrls.length === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
