"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/zod/product.validation";
import { cn } from "@/lib/utils";

interface ProductBasicInfoProps {
  values: ProductFormValues;
  errors: Record<string, string>;
  slugManuallyEdited: boolean;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
  onSlugManualEdit: () => void;
  onShortDescriptionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
}

export function ProductBasicInfo({
  values,
  errors,
  slugManuallyEdited,
  onNameChange,
  onSlugChange,
  onSlugManualEdit,
  onShortDescriptionChange,
  onDescriptionChange,
  onBrandChange,
  onSkuChange,
  onBarcodeChange,
}: ProductBasicInfoProps) {
  const shortDescLen = values.details.shortDescription?.length ?? 0;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
        <CardDescription>Product name, identifiers, and descriptions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product name *</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Classic White Tee"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={values.details.slug ?? ""}
            onChange={(e) => {
              onSlugManualEdit();
              onSlugChange(e.target.value);
            }}
            placeholder="classic-white-tee"
          />
          <p className="text-xs text-muted-foreground">
            {slugManuallyEdited ? "Custom slug" : "Auto-generated from product name"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shortDescription">Short description</Label>
            <span
              className={cn(
                "text-xs",
                shortDescLen > 255 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {shortDescLen}/255
            </span>
          </div>
          <Input
            id="shortDescription"
            maxLength={255}
            value={values.details.shortDescription ?? ""}
            onChange={(e) => onShortDescriptionChange(e.target.value)}
            placeholder="Brief summary for listings and feeds"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full description</Label>
          <Textarea
            id="description"
            rows={5}
            value={values.description ?? ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Detailed product description..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={values.details.brand ?? ""}
              onChange={(e) => onBrandChange(e.target.value)}
              placeholder="Brand name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={values.sku ?? ""}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder="LT-1001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={values.details.barcode ?? ""}
              onChange={(e) => onBarcodeChange(e.target.value)}
              placeholder="Optional barcode"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
