"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CategoryImageUploadProps {
  existingUrl: string | null;
  onExistingChange: (url: string | null) => void;
  newFile: File | null;
  onNewFileChange: (file: File | null) => void;
}

export function CategoryImageUpload({
  existingUrl,
  onExistingChange,
  newFile,
  onNewFileChange,
}: CategoryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const preview = newFile ? URL.createObjectURL(newFile) : existingUrl;

  const addFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onNewFileChange(file);
    if (existingUrl) onExistingChange(null);
  };

  return (
    <div className="space-y-3">
      <Label>Category image</Label>

      {!preview ? (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) addFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="mb-2 h-7 w-7 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop or click to upload</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP</p>
          <Button type="button" variant="outline" size="sm" className="mt-3 gap-1">
            <ImagePlus className="h-4 w-4" />
            Choose image
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && addFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative aspect-[4/3] max-w-xs overflow-hidden rounded-lg border bg-muted">
          <Image src={preview} alt="Category preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => {
              onNewFileChange(null);
              onExistingChange(null);
            }}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
