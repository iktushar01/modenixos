"use client";

import { Fragment } from "react";
import { Input } from "@/components/ui/input";
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
import { Category, Collection } from "@/types/store.types";
import { formatPriceSample, getCurrencyName } from "@/lib/currency";
import { ProductTypeKey } from "@/lib/catalog/productCategoryConfig";

interface ProductStatusProps {
  values: ProductFormValues;
  currency: string;
  productType: ProductTypeKey;
  categoryTree: Category[];
  collections: Collection[];
  selectedCategory?: Category;
  showCondition: boolean;
  onCategoryChange: (id: string) => void;
  onCollectionChange: (id: string) => void;
  onStatusChange: (status: ProductFormValues["status"]) => void;
  onFeaturedChange: (featured: boolean) => void;
  onConditionChange: (condition: ProductFormValues["details"]["condition"]) => void;
}

export function ProductStatus({
  values,
  currency,
  productType,
  categoryTree,
  collections,
  selectedCategory,
  showCondition,
  onCategoryChange,
  onCollectionChange,
  onStatusChange,
  onFeaturedChange,
  onConditionChange,
}: ProductStatusProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedCategory ? (
            <p className="text-sm font-medium">{selectedCategory.name}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No category selected</p>
          )}
          <p className="text-xs text-muted-foreground capitalize">Type: {productType}</p>
          <Select
            value={values.categoryId || "none"}
            onValueChange={(v) => onCategoryChange(v === "none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categoryTree.map((parent) => (
                <Fragment key={parent.id}>
                  <SelectItem value={parent.id}>{parent.name}</SelectItem>
                  {parent.children?.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      — {child.name}
                    </SelectItem>
                  ))}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Collection</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Product status</CardTitle>
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
                <SelectItem value="DRAFT">Draft — hidden from storefront</SelectItem>
                <SelectItem value="ACTIVE">Published — visible on storefront</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div>
              <Label htmlFor="featured" className="text-sm font-medium">
                Featured product
              </Label>
              <p className="text-xs text-muted-foreground">Highlight on homepage and collections</p>
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
            Currency: {getCurrencyName(currency)} ({currency}). Example: {formatPriceSample(currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
