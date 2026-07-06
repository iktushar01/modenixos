"use client";

import { Fragment } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/store.types";
import { ProductTypeKey } from "@/lib/catalog/productCategoryConfig";

interface ProductCategoryPickerProps {
  categoryId: string;
  categoryTree: Category[];
  selectedCategory?: Category;
  productType: ProductTypeKey;
  onCategoryChange: (id: string) => void;
}

export function ProductCategoryPicker({
  categoryId,
  categoryTree,
  selectedCategory,
  productType,
  onCategoryChange,
}: ProductCategoryPickerProps) {
  return (
    <Card className="rounded-xl shadow-sm ring-1 ring-primary/10">
      <CardHeader className="pb-3">
        <CardTitle>Category</CardTitle>
        <CardDescription>
          Choose a category first — it unlocks the right fields, options, and attributes for your
          product.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label>Product category</Label>
          <Select
            value={categoryId || "none"}
            onValueChange={(v) => onCategoryChange(v === "none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
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
        </div>
        {selectedCategory ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedCategory.name}</span>
            {" · "}
            <span className="capitalize">{productType}</span> product type
          </p>
        ) : (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Pick a category to see relevant options and attributes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
