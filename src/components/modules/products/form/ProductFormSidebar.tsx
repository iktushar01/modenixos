"use client";

import Image from "next/image";
import { Check, ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/zod/product.validation";
import { Collection } from "@/types/store.types";
import { formatPrice, formatPriceSample, getCurrencyName } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface ProductFormSidebarProps {
  values: ProductFormValues;
  currency: string;
  collections: Collection[];
  previewImageUrl?: string | null;
  onCollectionChange: (id: string) => void;
  onStatusChange: (status: ProductFormValues["status"]) => void;
  onFeaturedChange: (featured: boolean) => void;
  onConditionChange: (condition: ProductFormValues["details"]["condition"]) => void;
  showCondition: boolean;
}

export function ProductFormSidebar({
  values,
  currency,
  collections,
  previewImageUrl,
  onCollectionChange,
  onStatusChange,
  onFeaturedChange,
  onConditionChange,
  showCondition,
}: ProductFormSidebarProps) {
  const checklist = [
    { label: "Product name", done: Boolean(values.name.trim()) },
    {
      label: "Cover image",
      done: Boolean(previewImageUrl),
    },
    { label: "Price set", done: values.price > 0 },
    { label: "Category", done: Boolean(values.categoryId) },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/40">
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={values.name || "Product preview"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-50" />
                <p className="text-xs">Add an image</p>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium leading-snug">{values.name || "Product name"}</p>
            <p className="text-sm font-semibold text-primary">
              {values.price > 0 ? formatPrice(values.price, currency) : formatPriceSample(currency)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Setup progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {doneCount} of {checklist.length} complete
          </p>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    item.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/30",
                  )}
                >
                  {item.done && <Check className="h-3 w-3" />}
                </span>
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={values.status}
              onValueChange={(v) => onStatusChange(v as ProductFormValues["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft — hidden</SelectItem>
                <SelectItem value="ACTIVE">Published — live</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Collection</Label>
            <Select
              value={values.collectionId || "none"}
              onValueChange={(v) => onCollectionChange(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No collection</SelectItem>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div>
              <Label htmlFor="featured" className="text-sm font-medium">
                Featured product
              </Label>
              <p className="text-xs text-muted-foreground">Highlight on homepage</p>
            </div>
            <Switch
              id="featured"
              checked={values.details.featured ?? false}
              onCheckedChange={onFeaturedChange}
            />
          </div>

          {showCondition && (
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select
                value={values.details.condition ?? "NEW"}
                onValueChange={(v) =>
                  onConditionChange(v as ProductFormValues["details"]["condition"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Prices in {getCurrencyName(currency)} ({currency})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
