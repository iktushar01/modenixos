"use client";

import { useMemo } from "react";
import { Check, Palette, Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  STOREFRONT_COLOR_FIELDS,
  STOREFRONT_PALETTE_PRESETS,
  StorefrontColorMode,
  StorefrontColorPalette,
  mergePalette,
  getPresetById,
} from "@/lib/storefront";

interface StoreColorPaletteEditorProps {
  colorMode: StorefrontColorMode;
  palettePreset: string;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  onColorModeChange: (mode: StorefrontColorMode) => void;
  onPresetChange: (presetId: string) => void;
  onCustomColorsChange: (colors: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>) => void;
}

function resolvePreviewPalette(
  presetId: string,
  colorMode: StorefrontColorMode,
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>,
): StorefrontColorPalette {
  const preset = getPresetById(presetId) ?? STOREFRONT_PALETTE_PRESETS[0];
  const base = colorMode === "dark" ? preset.dark : preset.light;
  if (presetId === "custom") {
    return mergePalette(base, customColors?.[colorMode], colorMode);
  }
  return mergePalette(base, undefined, colorMode);
}

export function StoreColorPaletteEditor({
  colorMode,
  palettePreset,
  customColors,
  onColorModeChange,
  onPresetChange,
  onCustomColorsChange,
}: StoreColorPaletteEditorProps) {
  const preview = useMemo(
    () => resolvePreviewPalette(palettePreset, colorMode, customColors),
    [palettePreset, colorMode, customColors],
  );

  const isCustom = palettePreset === "custom";

  const handleCustomColorChange = (key: keyof StorefrontColorPalette, value: string) => {
    onCustomColorsChange({
      ...customColors,
      [colorMode]: {
        ...(customColors?.[colorMode] ?? {}),
        [key]: value,
      },
    });
  };

  const startCustomFromPreset = () => {
    const preset = getPresetById(palettePreset) ?? STOREFRONT_PALETTE_PRESETS[0];
    onCustomColorsChange({
      light: { ...preset.light },
      dark: { ...preset.dark },
    });
    onPresetChange("custom");
  };

  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof STOREFRONT_COLOR_FIELDS> = {};
    for (const field of STOREFRONT_COLOR_FIELDS) {
      if (!groups[field.group]) groups[field.group] = [];
      groups[field.group].push(field);
    }
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Label className="text-sm font-medium">Storefront mode</Label>
        <div className="flex rounded-lg border p-1">
          <Button
            type="button"
            size="sm"
            variant={colorMode === "light" ? "default" : "ghost"}
            className="gap-1.5"
            onClick={() => onColorModeChange("light")}
          >
            <Sun className="h-4 w-4" />
            Light
          </Button>
          <Button
            type="button"
            size="sm"
            variant={colorMode === "dark" ? "default" : "ghost"}
            className="gap-1.5"
            onClick={() => onColorModeChange("dark")}
          >
            <Moon className="h-4 w-4" />
            Dark
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium">Color palettes</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOREFRONT_PALETTE_PRESETS.map((preset) => {
            const swatch = colorMode === "dark" ? preset.dark : preset.light;
            const selected = palettePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onPresetChange(preset.id)}
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
                <div className="mb-3 flex gap-1">
                  {[swatch.background, swatch.primary, swatch.secondary, swatch.accent].map((c, i) => (
                    <span key={i} className="h-6 w-6 rounded-full border" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{preset.description}</p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={startCustomFromPreset}
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
            <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Make your own</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Customize every color token</p>
          </button>
        </div>
      </div>

      {/* Live preview strip */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: preview.background,
          color: preview.foreground,
        }}
      >
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: preview.navbar, color: preview.navbarForeground }}>
          <span className="text-xs font-medium">Navbar preview</span>
          <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: preview.secondary, color: preview.secondaryForeground }}>
            Sale
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: preview.card, color: preview.cardForeground, border: `1px solid ${preview.border}` }}>
            <p className="text-xs opacity-60">Product card</p>
            <p className="mt-1 text-sm font-medium">Sample item</p>
            <button type="button" className="mt-2 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: preview.primary, color: preview.primaryForeground }}>
              Add to cart
            </button>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: preview.surface, color: preview.surfaceForeground }}>
            <p className="text-xs" style={{ color: preview.mutedForeground }}>Muted text</p>
            <p className="mt-1 text-sm" style={{ color: preview.accent }}>Accent highlight</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: preview.footer, color: preview.footerForeground }}>
            <p className="text-xs">Footer area</p>
          </div>
        </div>
      </div>

      {isCustom && (
        <div className="space-y-6 rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">
            Custom colors — {colorMode === "dark" ? "Dark" : "Light"} mode
          </p>
          {Object.entries(groupedFields).map(([group, fields]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(({ key, label }) => {
                  const value = (isCustom ? customColors?.[colorMode]?.[key] : undefined) ?? preview[key];
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={`color-${key}`} className="text-xs">
                        {label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`color-${key}`}
                          type="color"
                          value={value.startsWith("rgba") ? "#000000" : value}
                          onChange={(e) => handleCustomColorChange(key, e.target.value)}
                          className="h-9 w-12 cursor-pointer p-1"
                          disabled={value.startsWith("rgba")}
                        />
                        <Input
                          value={value}
                          onChange={(e) => handleCustomColorChange(key, e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
