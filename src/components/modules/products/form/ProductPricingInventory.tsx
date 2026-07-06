"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/zod/product.validation";

interface ProductPricingInventoryProps {
  values: ProductFormValues;
  errors: Record<string, string>;
  currency: string;
  variantsEnabled: boolean;
  onPriceChange: (value: number) => void;
  onDiscountPriceChange: (value: number | "") => void;
  onCostPriceChange: (value: number | "") => void;
  onTrackInventoryChange: (value: boolean) => void;
  onStockChange: (value: number) => void;
  onLowStockAlertChange: (value: number) => void;
  onUnitNameChange: (value: string) => void;
}

export function ProductPricingInventory({
  values,
  errors,
  currency,
  variantsEnabled,
  onPriceChange,
  onDiscountPriceChange,
  onCostPriceChange,
  onTrackInventoryChange,
  onStockChange,
  onLowStockAlertChange,
  onUnitNameChange,
}: ProductPricingInventoryProps) {
  const trackInventory = values.details.trackInventory ?? true;
  const salePercent =
    typeof values.discountPrice === "number" &&
    values.discountPrice > 0 &&
    values.discountPrice < values.price
      ? Math.round((1 - values.discountPrice / values.price) * 100)
      : null;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Pricing &amp; inventory</CardTitle>
        <CardDescription>
          {variantsEnabled
            ? "Base prices used when generating variants. Stock is managed per variant below."
            : "Set how much this product costs and how many you have in stock."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
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
              placeholder="Optional"
            />
            {salePercent !== null && (
              <p className="text-xs text-green-600 dark:text-green-400">{salePercent}% off</p>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor="buyingPrice" className="text-muted-foreground">
            Cost price ({currency}) — optional
          </Label>
          <Input
            id="buyingPrice"
            type="number"
            min="0"
            step="0.01"
            className="max-w-xs"
            value={typeof values.details.buyingPrice === "number" ? values.details.buyingPrice : ""}
            onChange={(e) =>
              onCostPriceChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Internal cost (not shown to customers)"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div>
            <Label htmlFor="trackInventory" className="text-sm font-medium">
              Track inventory
            </Label>
            <p className="text-xs text-muted-foreground">
              Turn off for digital or made-to-order products
            </p>
          </div>
          <Switch
            id="trackInventory"
            checked={trackInventory}
            onCheckedChange={onTrackInventoryChange}
          />
        </div>

        {!variantsEnabled && trackInventory && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={values.stock}
                onChange={(e) => onStockChange(Number(e.target.value))}
              />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Low stock alert</Label>
              <Input
                id="lowStockAlert"
                type="number"
                min="0"
                value={values.details.lowStockAlert ?? ""}
                onChange={(e) => onLowStockAlertChange(Number(e.target.value))}
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitName">Unit name</Label>
              <Input
                id="unitName"
                value={values.details.unitName ?? ""}
                onChange={(e) => onUnitNameChange(e.target.value)}
                placeholder="piece, set, pair"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
