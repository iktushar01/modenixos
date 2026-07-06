"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductVariantForm } from "@/zod/product.validation";
import { formatVariantLabel } from "@/lib/catalog/productVariants";

interface ProductVariantsProps {
  variants: ProductVariantForm[];
  currency: string;
  errors: Record<string, string>;
  onChange: (variants: ProductVariantForm[]) => void;
  embedded?: boolean;
}

export function ProductVariants({
  variants,
  currency,
  errors,
  onChange,
  embedded = false,
}: ProductVariantsProps) {
  if (variants.length === 0) return null;

  const table = (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="px-3 py-2 font-medium">Variant</th>
            <th className="px-3 py-2 font-medium">Stock</th>
            <th className="px-3 py-2 font-medium">Price ({currency})</th>
            <th className="px-3 py-2 font-medium">Sale ({currency})</th>
            <th className="px-3 py-2 font-medium">SKU</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id} className="border-b border-border last:border-0">
              <td className="px-3 py-2 font-medium whitespace-nowrap">
                {formatVariantLabel(variant.options)}
              </td>
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    onChange(
                      variants.map((v) =>
                        v.id === variant.id ? { ...v, stock: Number(e.target.value) } : v,
                      ),
                    )
                  }
                  className="h-8 w-20"
                />
              </td>
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeof variant.price === "number" ? variant.price : ""}
                  onChange={(e) =>
                    onChange(
                      variants.map((v) =>
                        v.id === variant.id
                          ? { ...v, price: e.target.value === "" ? "" : Number(e.target.value) }
                          : v,
                      ),
                    )
                  }
                  className="h-8 w-24"
                />
              </td>
              <td className="px-3 py-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeof variant.salePrice === "number" ? variant.salePrice : ""}
                  onChange={(e) =>
                    onChange(
                      variants.map((v) =>
                        v.id === variant.id
                          ? {
                              ...v,
                              salePrice: e.target.value === "" ? "" : Number(e.target.value),
                            }
                          : v,
                      ),
                    )
                  }
                  className="h-8 w-24"
                />
              </td>
              <td className="px-3 py-2">
                <Input
                  value={variant.sku ?? ""}
                  onChange={(e) =>
                    onChange(
                      variants.map((v) =>
                        v.id === variant.id ? { ...v, sku: e.target.value } : v,
                      ),
                    )
                  }
                  placeholder="SKU"
                  className="h-8 min-w-[100px]"
                />
              </td>
              <td className="px-3 py-2">
                <Select
                  value={variant.status}
                  onValueChange={(v) =>
                    onChange(
                      variants.map((item) =>
                        item.id === variant.id
                          ? { ...item, status: v as ProductVariantForm["status"] }
                          : item,
                      ),
                    )
                  }
                >
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (embedded) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Generated variants ({variants.length})</p>
          <p className="text-xs text-muted-foreground">
            Edit stock, pricing, and SKU for each combination.
          </p>
        </div>
        {errors.variants && <p className="text-sm text-destructive">{errors.variants}</p>}
        {table}
      </div>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Generated variants ({variants.length})</CardTitle>
        <CardDescription>
          Edit SKU, pricing, and stock for each combination. Changes update automatically when
          attributes change.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.variants && <p className="text-sm text-destructive">{errors.variants}</p>}
        {table}
      </CardContent>
    </Card>
  );
}
