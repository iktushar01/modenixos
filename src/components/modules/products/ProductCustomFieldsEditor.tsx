"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductCustomField } from "@/types/store.types";

interface ProductCustomFieldsEditorProps {
  value: ProductCustomField[];
  onChange: (fields: ProductCustomField[]) => void;
}

export function ProductCustomFieldsEditor({ value, onChange }: ProductCustomFieldsEditorProps) {
  const addField = () => {
    onChange([...value, { label: "", value: "" }]);
  };

  const updateField = (index: number, patch: Partial<ProductCustomField>) => {
    onChange(value.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  };

  const removeField = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Custom product details</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Add fields like brand, model, fabric type, or EMI — shown on the product page.
        </p>
      </div>
      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No custom fields yet. Add brand, fabric, model, and more.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                placeholder="Field name (e.g. Fabric)"
                className="flex-1"
              />
              <Input
                value={field.value}
                onChange={(e) => updateField(index, { value: e.target.value })}
                placeholder="Value"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addField}>
        <Plus className="h-4 w-4" />
        Add a new field
      </Button>
    </div>
  );
}
