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
import { TagInput } from "../TagInput";
import { AttributeDefinition } from "@/lib/catalog/productCategoryConfig";

interface CategoryFieldsProps {
  fields: AttributeDefinition[];
  values: Record<string, string | number>;
  errors: Record<string, string>;
  onChange: (key: string, value: string | number) => void;
}

export function CategoryFields({ fields, values, errors, onChange }: CategoryFieldsProps) {
  if (fields.length === 0) return null;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Category attributes</CardTitle>
        <CardDescription>Fields specific to the selected product category.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => {
          const errorKey = `categoryAttributes.${field.key}`;
          const value = values[field.key] ?? "";

          if (field.type === "select" && field.options) {
            return (
              <div key={field.key} className="space-y-2">
                <Label>
                  {field.label}
                  {field.required && " *"}
                </Label>
                <Select
                  value={String(value) || "none"}
                  onValueChange={(v) => onChange(field.key, v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {field.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[errorKey] && (
                  <p className="text-sm text-destructive">{errors[errorKey]}</p>
                )}
              </div>
            );
          }

          if (field.type === "tags") {
            const tags = String(value)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            return (
              <TagInput
                key={field.key}
                label={`${field.label}${field.required ? " *" : ""}`}
                value={tags}
                onChange={(next) => onChange(field.key, next.join(", "))}
                placeholder={field.placeholder}
                presets={field.presets}
              />
            );
          }

          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && " *"}
              </Label>
              <Input
                id={field.key}
                type={field.type === "number" ? "number" : "text"}
                value={value}
                onChange={(e) =>
                  onChange(
                    field.key,
                    field.type === "number" ? Number(e.target.value) : e.target.value,
                  )
                }
                placeholder={field.placeholder}
              />
              {errors[errorKey] && (
                <p className="text-sm text-destructive">{errors[errorKey]}</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
