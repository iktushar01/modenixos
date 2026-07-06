"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "../TagInput";
import { VariantAttributeDefinition } from "@/lib/catalog/productCategoryConfig";
import { VariantAttributeForm } from "@/zod/product.validation";

interface ProductAttributesProps {
  availableAttributes: VariantAttributeDefinition[];
  attributes: VariantAttributeForm[];
  errors: Record<string, string>;
  onChange: (attributes: VariantAttributeForm[]) => void;
  embedded?: boolean;
}

export function ProductAttributes({
  availableAttributes,
  attributes,
  errors,
  onChange,
  embedded = false,
}: ProductAttributesProps) {
  const usedNames = new Set(attributes.map((a) => a.name.toLowerCase()));

  const addAttribute = (name: string) => {
    if (!name || usedNames.has(name.toLowerCase())) return;
    const def = availableAttributes.find(
      (a) => a.label.toLowerCase() === name.toLowerCase() || a.key.toLowerCase() === name.toLowerCase(),
    );
    onChange([
      ...attributes,
      { name: def?.label ?? name, options: [] },
    ]);
  };

  const updateAttribute = (index: number, patch: Partial<VariantAttributeForm>) => {
    onChange(attributes.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const unusedDefs = availableAttributes.filter(
    (a) => !usedNames.has(a.label.toLowerCase()) && !usedNames.has(a.key.toLowerCase()),
  );

  const body = (
    <>
      {attributes.map((attr, index) => {
        const def = availableAttributes.find(
          (a) =>
            a.label.toLowerCase() === attr.name.toLowerCase() ||
            a.key.toLowerCase() === attr.name.toLowerCase(),
        );
        return (
          <div key={`${attr.name}-${index}`} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Label className="text-sm font-medium">{attr.name}</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeAttribute(index)}
                aria-label={`Remove ${attr.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <TagInput
              label="Options"
              value={attr.options}
              onChange={(options) => updateAttribute(index, { options })}
              placeholder={`Add ${attr.name.toLowerCase()} option`}
              presets={def?.presets}
            />
            {errors[`variantAttributes.${attr.name}`] && (
              <p className="mt-2 text-sm text-destructive">
                {errors[`variantAttributes.${attr.name}`]}
              </p>
            )}
          </div>
        );
      })}

      {unusedDefs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-sm">Add attribute:</Label>
          <Select onValueChange={addAttribute}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select attribute" />
            </SelectTrigger>
            <SelectContent>
              {unusedDefs.map((def) => (
                <SelectItem key={def.key} value={def.label}>
                  {def.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {availableAttributes.some((a) => a.allowCustom) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            const name = prompt("Custom attribute name (e.g. RAM, Storage):");
            if (name?.trim()) addAttribute(name.trim());
          }}
        >
          <Plus className="h-4 w-4" />
          Custom attribute
        </Button>
      )}

      {errors.variantAttributes && (
        <p className="text-sm text-destructive">{errors.variantAttributes}</p>
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{body}</div>;
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Variant attributes</CardTitle>
        <CardDescription>
          Define attributes like Size, Color, or Storage. All combinations will be generated
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{body}</CardContent>
    </Card>
  );
}
