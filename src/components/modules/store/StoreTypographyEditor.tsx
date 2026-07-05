"use client";

import { useMemo } from "react";
import { Check, Pencil, Type } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  STOREFRONT_FONT_OPTIONS,
  STOREFRONT_FONT_PRESETS,
  StorefrontTypography,
  buildGoogleFontsHref,
  buildGoogleFontsHrefForFamilies,
  getFontPresetById,
  resolveTypography,
} from "@/lib/storefront";

interface StoreTypographyEditorProps {
  typography: StorefrontTypography;
  onTypographyChange: (typography: StorefrontTypography) => void;
}

const editorFontsHref = buildGoogleFontsHrefForFamilies([
  ...STOREFRONT_FONT_PRESETS.flatMap((preset) => [preset.bodyFont, preset.displayFont]),
  ...STOREFRONT_FONT_OPTIONS,
]);

function FontPreview({
  bodyFont,
  displayFont,
}: {
  bodyFont: string;
  displayFont: string;
}) {
  const href = useMemo(() => buildGoogleFontsHref(bodyFont, displayFont), [bodyFont, displayFont]);

  return (
    <div className="rounded-xl border bg-card/60 p-5">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={href} />
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
      <p
        className="mt-3 text-3xl leading-tight"
        style={{ fontFamily: `"${displayFont}", Georgia, serif` }}
      >
        Summer Collection
      </p>
      <p
        className="mt-2 text-sm leading-relaxed text-muted-foreground"
        style={{ fontFamily: `"${bodyFont}", ui-sans-serif, system-ui, sans-serif` }}
      >
        Curated pieces for the modern wardrobe. Body text, product descriptions, and navigation use
        your body font.
      </p>
    </div>
  );
}

export function StoreTypographyEditor({
  typography,
  onTypographyChange,
}: StoreTypographyEditorProps) {
  const isCustom = typography.preset === "custom";
  const resolved = resolveTypography(typography);

  const handlePresetClick = (presetId: string) => {
    if (presetId === "custom") {
      const seed = getFontPresetById("editorial-classic") ?? STOREFRONT_FONT_PRESETS[0];
      onTypographyChange({
        preset: "custom",
        bodyFont: typography.bodyFont ?? seed.bodyFont,
        displayFont: typography.displayFont ?? seed.displayFont,
      });
      return;
    }

    onTypographyChange({ preset: presetId });
  };

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={editorFontsHref} />
      <div>
        <Label className="mb-3 block text-sm font-medium">Font pairings</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOREFRONT_FONT_PRESETS.map((preset) => {
            const selected = typography.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset.id)}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all hover:border-primary/50",
                  selected && "border-primary ring-2 ring-primary/20",
                )}
              >
                {selected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <p
                  className="mb-1 text-lg leading-tight"
                  style={{ fontFamily: `"${preset.displayFont}", Georgia, serif` }}
                >
                  Aa
                </p>
                <p
                  className="mb-3 text-xs text-muted-foreground"
                  style={{ fontFamily: `"${preset.bodyFont}", ui-sans-serif, system-ui, sans-serif` }}
                >
                  The quick brown fox
                </p>
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{preset.description}</p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {preset.displayFont} · {preset.bodyFont}
                </p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handlePresetClick("custom")}
            className={cn(
              "relative rounded-xl border border-dashed p-4 text-left transition-all hover:border-primary/50",
              isCustom && "border-primary ring-2 ring-primary/20",
            )}
          >
            {isCustom && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Custom fonts</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Pick body and display fonts manually
            </p>
          </button>
        </div>
      </div>

      {isCustom && (
        <div className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Type className="h-3.5 w-3.5" />
              Body font
            </Label>
            <p className="text-[11px] text-muted-foreground">Navigation, product text, forms</p>
            <Select
              value={typography.bodyFont ?? resolved.bodyFont}
              onValueChange={(bodyFont) => onTypographyChange({ ...typography, preset: "custom", bodyFont })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STOREFRONT_FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Type className="h-3.5 w-3.5" />
              Display font
            </Label>
            <p className="text-[11px] text-muted-foreground">Headlines, hero text, product titles</p>
            <Select
              value={typography.displayFont ?? resolved.displayFont}
              onValueChange={(displayFont) =>
                onTypographyChange({ ...typography, preset: "custom", displayFont })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STOREFRONT_FONT_OPTIONS.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: `"${font}", serif` }}>{font}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <FontPreview bodyFont={resolved.bodyFont} displayFont={resolved.displayFont} />
    </div>
  );
}
