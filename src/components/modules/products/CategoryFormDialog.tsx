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
  parentCategory?: Category | null;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  parentCategory,
}: CategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const isSubcategory = Boolean(parentCategory) || Boolean(category?.parentId);
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

      const parentId = parentCategory?.id ?? category?.parentId;
      if (parentId) {
        fd.append("parentId", parentId);
      } else if (isEdit && !category?.parentId) {
        fd.append("parentId", "");
      }

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
      toast.success(
        isEdit
          ? isSubcategory
            ? "Subcategory updated"
            : "Category updated"
          : isSubcategory
            ? "Subcategory created"
            : "Category created",
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: () =>
      toast.error(
        isEdit
          ? "Failed to update category"
          : isSubcategory
            ? "Failed to create subcategory"
            : "Failed to create category",
      ),
  });

  const title = isEdit
    ? isSubcategory
      ? "Edit subcategory"
      : "Edit category"
    : parentCategory
      ? `New subcategory under ${parentCategory.name}`
      : "New category";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isSubcategory
              ? "Subcategories appear under their parent in your storefront navigation."
              : "Top-level categories can contain subcategories. Crop images to 4:5 for your storefront."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name *</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isSubcategory ? "e.g. Polo Shirt" : "e.g. Shirts"}
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
              placeholder="polo-shirt"
            />
          </div>
          {!isSubcategory && (
            <CategoryImageUpload
              existingUrl={existingUrl}
              onExistingChange={(url) => {
                setExistingUrl(url);
                if (!url) setRemoveImage(true);
                else setRemoveImage(false);
              }}
              onNewFileChange={(file) => {
                setNewFile(file);
                setRemoveImage(false);
              }}
            />
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
            {isEdit ? "Save changes" : isSubcategory ? "Create subcategory" : "Create category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryThumbnail({
  category,
  compact,
}: {
  category: Category;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "relative h-8 w-7 overflow-hidden rounded border bg-muted"
          : "relative h-12 w-10 overflow-hidden rounded-md border bg-muted"
      }
    >
      {category.image ? (
        <Image src={category.image} alt={category.name} fill className="object-cover" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">—</div>
      )}
    </div>
  );
}
