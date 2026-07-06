"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TagInput } from "../TagInput";
import { SizeChartEditor } from "../SizeChartEditor";
import { ProductCustomFieldsEditor } from "../ProductCustomFieldsEditor";
import { ProductFormValues } from "@/zod/product.validation";

interface ProductAdvancedProps {
  values: ProductFormValues;
  slugManuallyEdited: boolean;
  showShipping: boolean;
  showSizeChart: boolean;
  showCareInstructions: boolean;
  showWeightDimensions: boolean;
  onSlugChange: (slug: string) => void;
  onSlugManualEdit: () => void;
  onSkuChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
  onProductSerialChange: (value: string) => void;
  onInitialSoldCountChange: (value: number) => void;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onDetailsChange: (patch: Partial<ProductFormValues["details"]>) => void;
}

export function ProductAdvanced({
  values,
  slugManuallyEdited,
  showShipping,
  showSizeChart,
  showCareInstructions,
  showWeightDimensions,
  onSlugChange,
  onSlugManualEdit,
  onSkuChange,
  onBarcodeChange,
  onProductSerialChange,
  onInitialSoldCountChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onTagsChange,
  onDetailsChange,
}: ProductAdvancedProps) {
  return (
    <Accordion type="multiple" className="rounded-xl border border-border bg-card shadow-sm">
      <AccordionItem value="identifiers" className="border-b px-4">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Identifiers &amp; URL
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Storefront URL slug</Label>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productSerial">Product serial</Label>
              <Input
                id="productSerial"
                value={values.details.productSerial ?? ""}
                onChange={(e) => onProductSerialChange(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialSoldCount">Initial sold count</Label>
              <Input
                id="initialSoldCount"
                type="number"
                min="0"
                value={values.details.initialSoldCount ?? 0}
                onChange={(e) => onInitialSoldCountChange(Number(e.target.value))}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="seo" className="border-b px-4">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          SEO
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              id="metaTitle"
              value={values.details.metaTitle ?? ""}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="Defaults to product name if empty"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              id="metaDescription"
              rows={3}
              value={values.details.metaDescription ?? ""}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="Brief description for search results"
              maxLength={500}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tags" className="border-b px-4">
        <AccordionTrigger className="text-base font-semibold hover:no-underline">
          Tags &amp; specifications
        </AccordionTrigger>
        <AccordionContent className="space-y-5 pb-4">
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
        </AccordionContent>
      </AccordionItem>

      {showWeightDimensions && (
        <AccordionItem value="weight" className="border-b px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            Weight &amp; dimensions
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                className="max-w-xs"
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
              <div className="grid max-w-md grid-cols-3 gap-2">
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
          </AccordionContent>
        </AccordionItem>
      )}

      {showShipping && (
        <AccordionItem value="shipping" className="px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            Shipping &amp; warranty
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
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
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
