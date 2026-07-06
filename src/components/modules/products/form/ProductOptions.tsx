"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "../TagInput";
import { ProductAttributes } from "./ProductAttributes";
import { ProductVariants } from "./ProductVariants";
import { ProductFormValues } from "@/zod/product.validation";
import { VariantAttributeDefinition } from "@/lib/catalog/productCategoryConfig";
import { ProductVariantForm } from "@/zod/product.validation";
import { cn } from "@/lib/utils";

export type ProductOptionMode = "none" | "simple" | "variants";

interface ProductOptionsProps {
  mode: ProductOptionMode;
  canEnableVariants: boolean;
  values: ProductFormValues;
  errors: Record<string, string>;
  currency: string;
  availableAttributes: VariantAttributeDefinition[];
  imageMode: "standard" | "color";
  existingUrls: string[];
  onModeChange: (mode: ProductOptionMode) => void;
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: string[]) => void;
  onColorImagesChange: (map: Record<string, string>) => void;
  onVariantAttributesChange: (attrs: ProductFormValues["details"]["variantAttributes"]) => void;
  onVariantsChange: (variants: ProductVariantForm[]) => void;
}

export function ProductOptions({
  mode,
  canEnableVariants,
  values,
  errors,
  currency,
  availableAttributes,
  imageMode,
  existingUrls,
  onModeChange,
  onSizesChange,
  onColorsChange,
  onColorImagesChange,
  onVariantAttributesChange,
  onVariantsChange,
}: ProductOptionsProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Product options</CardTitle>
        <CardDescription>
          Does this product come in different sizes, colors, or combinations?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Product options mode">
          {(
            [
              {
                id: "none" as const,
                title: "No options",
                desc: "Single version — one price and stock",
              },
              {
                id: "simple" as const,
                title: "Simple options",
                desc: "Size or color tags without a full matrix",
              },
              ...(canEnableVariants
                ? [
                    {
                      id: "variants" as const,
                      title: "Full variants",
                      desc: "Size × color with price & stock each",
                    },
                  ]
                : []),
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={mode === opt.id}
              onClick={() => onModeChange(opt.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border border-border p-4 text-left transition-colors",
                mode === opt.id && "border-primary bg-primary/5 ring-1 ring-primary/20",
              )}
            >
              <p className="text-sm font-medium">{opt.title}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </button>
          ))}
        </div>

        {mode === "simple" && (
          <div className="space-y-4 border-t border-border pt-4">
            <TagInput
              label="Sizes"
              value={values.sizes}
              onChange={onSizesChange}
              placeholder="Add size and press Enter"
              presets={["XS", "S", "M", "L", "XL", "XXL"]}
            />
            <TagInput
              label="Colors"
              value={values.colors}
              onChange={onColorsChange}
              placeholder="Add color and press Enter"
              presets={["Black", "White", "Navy", "Beige", "Red", "Green", "Gray"]}
            />
            {imageMode === "standard" && values.colors.length > 0 && existingUrls.length > 0 && (
              <div className="space-y-3">
                <Label>Color swatch images</Label>
                <p className="text-xs text-muted-foreground">
                  Map gallery images to colors on the product page.
                </p>
                {values.colors.map((color) => (
                  <div key={color} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium">{color}</span>
                    <select
                      className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                      value={values.details.colorImages[color] || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        const next = { ...values.details.colorImages };
                        if (url) next[color] = url;
                        else delete next[color];
                        onColorImagesChange(next);
                      }}
                    >
                      <option value="">No image</option>
                      {existingUrls.map((url, i) => (
                        <option key={url} value={url}>
                          Image {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === "variants" && canEnableVariants && (
          <div className="space-y-4 border-t border-border pt-4">
            <ProductAttributes
              availableAttributes={availableAttributes}
              attributes={values.details.variantAttributes ?? []}
              errors={errors}
              onChange={onVariantAttributesChange}
            />
            <ProductVariants
              variants={values.details.variants ?? []}
              currency={currency}
              errors={errors}
              onChange={onVariantsChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
