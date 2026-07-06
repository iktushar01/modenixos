"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/zod/product.validation";

interface ProductInventoryProps {
  values: ProductFormValues;
  errors: Record<string, string>;
  variantsEnabled: boolean;
  onTrackInventoryChange: (value: boolean) => void;
  onStockChange: (value: number) => void;
  onLowStockAlertChange: (value: number) => void;
  onUnitNameChange: (value: string) => void;
  onProductSerialChange: (value: string) => void;
  onInitialSoldCountChange: (value: number) => void;
}

export function ProductInventory({
  values,
  errors,
  variantsEnabled,
  onTrackInventoryChange,
  onStockChange,
  onLowStockAlertChange,
  onUnitNameChange,
  onProductSerialChange,
  onInitialSoldCountChange,
}: ProductInventoryProps) {
  const trackInventory = values.details.trackInventory ?? true;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>
          {variantsEnabled
            ? "Stock is managed per variant. Totals are calculated automatically."
            : "Track stock levels and low-stock alerts."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div>
            <Label htmlFor="trackInventory" className="text-sm font-medium">
              Track inventory
            </Label>
            <p className="text-xs text-muted-foreground">
              Disable for digital or made-to-order products
            </p>
          </div>
          <Switch
            id="trackInventory"
            checked={trackInventory}
            onCheckedChange={onTrackInventoryChange}
          />
        </div>

        {!variantsEnabled && trackInventory && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock quantity</Label>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="productSerial">Product serial</Label>
            <Input
              id="productSerial"
              value={values.details.productSerial ?? ""}
              onChange={(e) => onProductSerialChange(e.target.value)}
              placeholder="Optional serial"
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
      </CardContent>
    </Card>
  );
}
