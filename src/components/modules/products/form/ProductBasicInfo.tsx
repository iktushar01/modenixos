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
  onNameChange: (name: string) => void;
  onShortDescriptionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBrandChange: (value: string) => void;
}

export function ProductBasicInfo({
  values,
  errors,
  onNameChange,
  onShortDescriptionChange,
  onDescriptionChange,
  onBrandChange,
}: ProductBasicInfoProps) {
  const shortDescLen = values.details.shortDescription?.length ?? 0;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Product details</CardTitle>
        <CardDescription>Name and description shown on your storefront.</CardDescription>
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
            placeholder="Brief summary for listings and search"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full description</Label>
          <Textarea
            id="description"
            rows={5}
            value={values.description ?? ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Tell customers about materials, fit, features..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={values.details.brand ?? ""}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Optional brand name"
            className="max-w-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
