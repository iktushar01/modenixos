"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryImageUpload } from "./CategoryImageUpload";
import { createCategoryAction, updateCategoryAction } from "@/actions/catalog.actions";
import { Category } from "@/types/store.types";

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setSlug(category?.slug ?? "");
      setSlugTouched(false);
      setExistingUrl(category?.image ?? null);
      setNewFile(null);
      setRemoveImage(false);
    }
  }, [open, category]);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (slug.trim()) fd.append("slug", slug.trim());
      if (isEdit && removeImage && !newFile) {
        fd.append("image", "");
      }
      if (newFile) fd.append("image", newFile);

      if (isEdit && category) {
        return updateCategoryAction(category.id, fd);
      }
      return createCategoryAction(fd);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: () => toast.error(isEdit ? "Failed to update category" : "Failed to create category"),
  });

  const handleRemoveImage = () => {
    setNewFile(null);
    setExistingUrl(null);
    setRemoveImage(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update name, slug, or cover image." : "Add a category with an optional cover image for your storefront."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name *</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. T-Shirts"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="t-shirts"
            />
          </div>
          <CategoryImageUpload
            existingUrl={existingUrl}
            onExistingChange={(url) => {
              setExistingUrl(url);
              if (!url) setRemoveImage(true);
              else setRemoveImage(false);
            }}
            newFile={newFile}
            onNewFileChange={(file) => {
              setNewFile(file);
              setRemoveImage(false);
            }}
          />
          {(existingUrl || newFile) && (
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={handleRemoveImage}>
              Remove image
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!name.trim() || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Thumbnail for table rows */
export function CategoryThumbnail({ category }: { category: Category }) {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
      {category.image ? (
        <Image src={category.image} alt={category.name} fill className="object-cover" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">—</div>
      )}
    </div>
  );
}
