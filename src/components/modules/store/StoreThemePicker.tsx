"use client";

import Link from "next/link";
import { Check, LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STOREFRONT_TEMPLATES, StorefrontTemplateId } from "@/lib/storefront";

interface StoreThemePickerProps {
  value: StorefrontTemplateId;
  onChange: (templateId: StorefrontTemplateId) => void;
}

function ThemePreviewMock({ active }: { active?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted/40 p-3",
        active ? "border-primary/40" : "border-border",
      )}
    >
      <div className="mb-2 h-2 w-full rounded-full bg-muted-foreground/15" />
      <div className="mb-3 h-8 w-full rounded-md bg-muted-foreground/10" />
      <div className="grid grid-cols-3 gap-1.5">
        <div className="col-span-2 h-14 rounded-md bg-muted-foreground/10" />
        <div className="h-14 rounded-md bg-muted-foreground/10" />
        <div className="h-10 rounded-md bg-muted-foreground/10" />
        <div className="h-10 rounded-md bg-muted-foreground/10" />
        <div className="h-10 rounded-md bg-muted-foreground/10" />
      </div>
    </div>
  );
}

export function StoreThemePicker({ value, onChange }: StoreThemePickerProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose the layout for your public shop and preview each theme before selecting it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STOREFRONT_TEMPLATES.map((template) => {
          const isActive = value === template.id;

          return (
            <div
              key={template.id}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-4 text-left transition-colors",
                isActive
                  ? "border-primary ring-1 ring-primary/20 bg-accent/30"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <button type="button" onClick={() => onChange(template.id)} className="text-left">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <LayoutTemplate className="h-4 w-4" />
                  </div>
                  {isActive ? (
                    <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                      <Check className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : null}
                </div>

                <ThemePreviewMock active={isActive} />

                <h3 className="mt-3 text-sm font-medium tracking-tight">{template.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
              </button>

              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={template.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Demo website
                </Link>
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => onChange(template.id)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Use theme
                  </button>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">Selected</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
