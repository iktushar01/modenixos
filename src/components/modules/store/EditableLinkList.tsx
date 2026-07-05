"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontNavLink } from "@/lib/storefront";

interface EditableLinkListProps {
  label: string;
  description?: string;
  links: StorefrontNavLink[];
  onChange: (links: StorefrontNavLink[]) => void;
  hrefPlaceholder?: string;
}

export function EditableLinkList({
  label,
  description,
  links,
  onChange,
  hrefPlaceholder = "/about or #shop",
}: EditableLinkListProps) {
  const addLink = () => {
    onChange([...links, { label: "", href: "" }]);
  };

  const updateLink = (index: number, field: keyof StorefrontNavLink, value: string) => {
    onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const next = [...links];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>{label}</Label>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>

      {links.length === 0 && (
        <p className="text-sm text-muted-foreground">No links yet.</p>
      )}

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, "label", e.target.value)}
                  placeholder="About Us"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL</Label>
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(index, "href", e.target.value)}
                  placeholder={hrefPlaceholder}
                />
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={index === 0}
                onClick={() => moveLink(index, -1)}
                aria-label="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={index === links.length - 1}
                onClick={() => moveLink(index, 1)}
                aria-label="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-9 w-9"
                onClick={() => removeLink(index)}
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addLink}>
        <Plus className="mr-1.5 h-4 w-4" />
        Add link
      </Button>
    </div>
  );
}
