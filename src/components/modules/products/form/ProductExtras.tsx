"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "../TagInput";
import { SizeChartEditor } from "../SizeChartEditor";
import { ProductCustomFieldsEditor } from "../ProductCustomFieldsEditor";
import { ProductFormValues } from "@/zod/product.validation";

interface ProductExtrasProps {
  values: ProductFormValues;
  showShipping: boolean;
  showSizeChart: boolean;
  showCareInstructions: boolean;
  showWeightDimensions: boolean;
  variantsEnabled: boolean;
  imageMode: "standard" | "color";
  existingUrls: string[];
  onDetailsChange: (patch: Partial<ProductFormValues["details"]>) => void;
  onTagsChange: (tags: string[]) => void;
  onLegacySizesChange: (sizes: string[]) => void;
  onLegacyColorsChange: (colors: string[]) => void;
}

export function ProductExtras({
  values,
  showShipping,
  showSizeChart,
  showCareInstructions,
  showWeightDimensions,
  variantsEnabled,
  imageMode,
  existingUrls,
  onDetailsChange,
  onTagsChange,
  onLegacySizesChange,
  onLegacyColorsChange,
}: ProductExtrasProps) {
  return (
    <div className="space-y-4">
      {!variantsEnabled && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Simple options</CardTitle>
            <CardDescription>
              Quick size and color tags for products without variant combinations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TagInput
              label="Sizes"
              value={values.sizes}
              onChange={onLegacySizesChange}
              placeholder="Add size and press Enter"
              presets={["XS", "S", "M", "L", "XL", "XXL"]}
            />
            <TagInput
              label="Colors"
              value={values.colors}
              onChange={onLegacyColorsChange}
              placeholder="Add color and press Enter"
              presets={["Black", "White", "Navy", "Beige", "Red", "Green", "Gray"]}
            />
            {imageMode === "standard" && values.colors.length > 0 && existingUrls.length > 0 && (
              <div className="space-y-3 border-t border-border pt-4">
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
                        onDetailsChange({ colorImages: next });
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
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Tags &amp; specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TagInput
            label="Tags"
            value={values.tags}
            onChange={onTagsChange}
            placeholder="e.g. summer, cotton, new"
          />
          <TagInput
            label="Specifications"
            value={values.details.specifications}
            onChange={(v) => onDetailsChange({ specifications: v })}
            placeholder="Add a specification"
          />
          {showCareInstructions && (
            <TagInput
              label="Care instructions"
              value={values.details.careInstructions}
              onChange={(v) => onDetailsChange({ careInstructions: v })}
              placeholder="e.g. Machine wash cold"
            />
          )}
          <ProductCustomFieldsEditor
            value={values.details.customFields ?? []}
            onChange={(customFields) => onDetailsChange({ customFields })}
          />
          {showSizeChart && (
            <SizeChartEditor
              value={values.details.sizeChart}
              onChange={(chart) => onDetailsChange({ sizeChart: chart })}
            />
          )}
        </CardContent>
      </Card>

      {showWeightDimensions && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Weight &amp; dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                value={typeof values.details.weight === "number" ? values.details.weight : ""}
                onChange={(e) =>
                  onDetailsChange({
                    weight: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={values.details.dimensions?.length ?? ""}
                  onChange={(e) =>
                    onDetailsChange({
                      dimensions: {
                        ...values.details.dimensions,
                        length: e.target.value === "" ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Length"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={values.details.dimensions?.width ?? ""}
                  onChange={(e) =>
                    onDetailsChange({
                      dimensions: {
                        ...values.details.dimensions,
                        width: e.target.value === "" ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Width"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={values.details.dimensions?.height ?? ""}
                  onChange={(e) =>
                    onDetailsChange({
                      dimensions: {
                        ...values.details.dimensions,
                        height: e.target.value === "" ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Height"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showShipping && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
            <CardDescription>Delivery settings for physical products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <Label htmlFor="useDefaultShipping" className="text-sm font-medium">
                  Apply default delivery charges
                </Label>
                <p className="text-xs text-muted-foreground">
                  Uses the policy from Shop → Shipping settings
                </p>
              </div>
              <Switch
                id="useDefaultShipping"
                checked={values.details.useDefaultShipping ?? true}
                onCheckedChange={(v) => onDetailsChange({ useDefaultShipping: v })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryOverride">
                {values.details.useDefaultShipping
                  ? "Additional delivery note (optional)"
                  : "Product delivery override"}
              </Label>
              <Textarea
                id="deliveryOverride"
                rows={3}
                value={values.details.deliveryOverride ?? ""}
                onChange={(e) => onDetailsChange({ deliveryOverride: e.target.value })}
                placeholder="Custom delivery information"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={values.details.warranty ?? ""}
                onChange={(e) => onDetailsChange({ warranty: e.target.value })}
                placeholder="e.g. 1 year"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
