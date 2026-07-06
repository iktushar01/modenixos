"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollectionImageUpload } from "./CollectionImageUpload";
import { createCollectionAction, updateCollectionAction } from "@/actions/catalog.actions";
import { Collection } from "@/types/store.types";

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

interface CollectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: Collection | null;
}

export function CollectionFormDialog({ open, onOpenChange, collection }: CollectionFormDialogProps) {
  const isEdit = Boolean(collection);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (open) {
      setName(collection?.name ?? "");
      setSlug(collection?.slug ?? "");
      setSlugTouched(false);
      setIsFeatured(collection?.isFeatured ?? false);
      setExistingUrl(collection?.image ?? null);
      setNewFile(null);
      setRemoveImage(false);
    }
  }, [open, collection]);

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
      fd.append("isFeatured", String(isFeatured));
      if (isEdit && removeImage && !newFile) {
        fd.append("image", "");
      }
      if (newFile) fd.append("image", newFile);

      if (isEdit && collection) {
        return updateCollectionAction(collection.id, fd);
      }
      return createCollectionAction(fd);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Collection updated" : "Collection created");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      onOpenChange(false);
    },
    onError: () => toast.error(isEdit ? "Failed to update collection" : "Failed to create collection"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit collection" : "New collection"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update name, slug, featured flag, or cover image."
              : "Add a curated collection with an optional cover image for your storefront."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="col-name">Name *</Label>
            <Input
              id="col-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Edit"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-slug">Slug</Label>
            <Input
              id="col-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="summer-edit"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="col-featured"
              checked={isFeatured}
              onCheckedChange={(v) => setIsFeatured(!!v)}
            />
            <Label htmlFor="col-featured">Featured on storefront</Label>
          </div>
          <CollectionImageUpload
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
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={!name.trim() || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CollectionThumbnail({ collection }: { collection: Collection }) {
  return (
    <div className="relative h-12 w-9 overflow-hidden rounded-md border bg-muted">
      {collection.image ? (
        <Image src={collection.image} alt={collection.name} fill className="object-cover" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">—</div>
      )}
    </div>
  );
}
