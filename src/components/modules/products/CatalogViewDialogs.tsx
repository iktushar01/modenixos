"use client";

import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category, Collection } from "@/types/store.types";
import { CategoryThumbnail } from "./CategoryFormDialog";
import { CollectionThumbnail } from "./CollectionFormDialog";
import { ProductViewDialog } from "./ProductViewDialog";

export { ProductViewDialog };

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

type CategoryViewDialogProps = {
  category: Category | null;
  categories?: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (category: Category) => void;
};

export function CategoryViewDialog({
  category,
  categories = [],
  open,
  onOpenChange,
  onEdit,
}: CategoryViewDialogProps) {
  const parent = category?.parentId
    ? categories.find((item) => item.id === category.parentId)
    : null;
  const childCount = category?.children?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{category?.name ?? "Category details"}</DialogTitle>
          <DialogDescription>Category information for your storefront navigation.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {category ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <CategoryThumbnail category={category} />
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
              </div>

              <dl className="space-y-4">
                <DetailRow label="Type">
                  {category.parentId ? "Subcategory" : "Top-level category"}
                </DetailRow>
                {parent ? <DetailRow label="Parent">{parent.name}</DetailRow> : null}
                {!category.parentId ? (
                  <DetailRow label="Subcategories">{childCount}</DetailRow>
                ) : null}
                <DetailRow label="Slug">{category.slug}</DetailRow>
              </dl>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter showCloseButton>
          {category && onEdit ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(category);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CollectionViewDialogProps = {
  collection: Collection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (collection: Collection) => void;
};

export function CollectionViewDialog({
  collection,
  open,
  onOpenChange,
  onEdit,
}: CollectionViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{collection?.name ?? "Collection details"}</DialogTitle>
          <DialogDescription>Curated product group for your storefront.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {collection ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <CollectionThumbnail collection={collection} />
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold">{collection.name}</p>
                  <p className="text-sm text-muted-foreground">/{collection.slug}</p>
                </div>
              </div>

              <dl className="space-y-4">
                <DetailRow label="Slug">{collection.slug}</DetailRow>
                <DetailRow label="Featured">
                  {collection.isFeatured ? (
                    <Badge variant="secondary">Featured on homepage</Badge>
                  ) : (
                    "No"
                  )}
                </DetailRow>
              </dl>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter showCloseButton>
          {collection && onEdit ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(collection);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit collection
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
