"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/zod/product.validation";

interface ProductPricingProps {
  values: ProductFormValues;
  errors: Record<string, string>;
  currency: string;
  onPriceChange: (value: number) => void;
  onDiscountPriceChange: (value: number | "") => void;
  onCostPriceChange: (value: number | "") => void;
  variantsEnabled: boolean;
}

export function ProductPricing({
  values,
  errors,
  currency,
  onPriceChange,
  onDiscountPriceChange,
  onCostPriceChange,
  variantsEnabled,
}: ProductPricingProps) {
  const salePercent =
    typeof values.discountPrice === "number" &&
    values.discountPrice > 0 &&
    values.discountPrice < values.price
      ? Math.round((1 - values.discountPrice / values.price) * 100)
      : null;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>
          {variantsEnabled
            ? "Default prices used when generating new variants. Edit per-variant prices below."
            : "Set regular, sale, and cost prices for this product."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Regular price ({currency}) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={values.price || ""}
              onChange={(e) => onPriceChange(Number(e.target.value))}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Sale price ({currency})</Label>
            <Input
              id="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={typeof values.discountPrice === "number" ? values.discountPrice : ""}
              onChange={(e) =>
                onDiscountPriceChange(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Optional sale price"
            />
            {salePercent !== null && (
              <p className="text-xs text-green-600">{salePercent}% off regular price</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="buyingPrice">Cost price ({currency})</Label>
            <Input
              id="buyingPrice"
              type="number"
              min="0"
              step="0.01"
              value={
                typeof values.details.buyingPrice === "number" ? values.details.buyingPrice : ""
              }
              onChange={(e) =>
                onCostPriceChange(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Internal cost"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
