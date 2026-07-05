"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Palette, Sun, Moon, Pencil } from "lucide-react";
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
  resolvePresetPalette,
} from "@/lib/storefront";

interface StoreColorPaletteEditorProps {
  colorMode: StorefrontColorMode;
  palettePreset: string;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  onColorModeChange: (mode: StorefrontColorMode) => void;
  onPresetChange: (presetId: string) => void;
  onCustomColorsChange: (colors: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>) => void;
}

const COLOR_COUNT = STOREFRONT_COLOR_FIELDS.length;

function resolvePreviewPalette(
  presetId: string,
  colorMode: StorefrontColorMode,
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>,
): StorefrontColorPalette {
  if (presetId === "custom") {
    const custom = customColors?.[colorMode];
    if (custom?.background) {
      return mergePalette(custom as StorefrontColorPalette, undefined, colorMode);
    }
    const preset = getPresetById("classic-retail") ?? STOREFRONT_PALETTE_PRESETS[0];
    const base = colorMode === "dark" ? preset.dark : preset.light;
    return mergePalette(base, custom, colorMode);
  }
  return resolvePresetPalette(presetId, colorMode);
}

function ColorSwatch({ value, size = "md" }: { value: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  return (
    <span
      className={cn("shrink-0 rounded-md border shadow-sm", sizeClass)}
      style={{ backgroundColor: value }}
      title={value}
    />
  );
}

interface PaletteColorGridProps {
  palette: StorefrontColorPalette;
  editable: boolean;
  colorMode: StorefrontColorMode;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  onCustomColorChange?: (key: keyof StorefrontColorPalette, value: string) => void;
}

function PaletteColorGrid({
  palette,
  editable,
  colorMode,
  customColors,
  onCustomColorChange,
}: PaletteColorGridProps) {
  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof STOREFRONT_COLOR_FIELDS> = {};
    for (const field of STOREFRONT_COLOR_FIELDS) {
      if (!groups[field.group]) groups[field.group] = [];
      groups[field.group].push(field);
    }
    return groups;
  }, []);

  return (
    <div className="space-y-5">
      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map(({ key, label }) => {
              const value =
                (editable ? customColors?.[colorMode]?.[key] : undefined) ?? palette[key];
              if (editable && onCustomColorChange) {
                return (
                  <div key={key} className="space-y-1.5 rounded-lg border bg-background p-2.5">
                    <Label htmlFor={`color-${key}`} className="text-xs">
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <ColorSwatch value={value} size="sm" />
                      <Input
                        id={`color-${key}`}
                        type="color"
                        value={value.startsWith("rgba") ? "#000000" : value}
                        onChange={(e) => onCustomColorChange(key, e.target.value)}
                        className="h-8 w-10 cursor-pointer p-0.5"
                        disabled={value.startsWith("rgba")}
                      />
                      <Input
                        value={value}
                        onChange={(e) => onCustomColorChange(key, e.target.value)}
                        className="h-8 flex-1 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={key}
                  className="flex items-center gap-2.5 rounded-lg border bg-background p-2.5"
                >
                  <ColorSwatch value={value} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{label}</p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StoreColorPaletteEditor({
  colorMode,
  palettePreset,
  customColors,
  onColorModeChange,
  onPresetChange,
  onCustomColorsChange,
}: StoreColorPaletteEditorProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);

  const preview = useMemo(
    () => resolvePreviewPalette(palettePreset, colorMode, customColors),
    [palettePreset, colorMode, customColors],
  );

  const isCustom = palettePreset === "custom";

  const selectedPreset = isCustom
    ? null
    : (getPresetById(palettePreset) ?? STOREFRONT_PALETTE_PRESETS[0]);

  const handleCustomColorChange = (key: keyof StorefrontColorPalette, value: string) => {
    onCustomColorsChange({
      ...customColors,
      [colorMode]: {
        ...(customColors?.[colorMode] ?? {}),
        [key]: value,
      },
    });
  };

  const startCustomFromPreset = (sourcePresetId?: string) => {
    const id =
      sourcePresetId ?? (palettePreset === "custom" ? "classic-retail" : palettePreset);
    const preset = getPresetById(id) ?? STOREFRONT_PALETTE_PRESETS[0];
    onCustomColorsChange({
      light: mergePalette(preset.light, undefined, "light"),
      dark: mergePalette(preset.dark, undefined, "dark"),
    });
    onPresetChange("custom");
    setDetailsOpen(true);
  };

  const handlePresetClick = (presetId: string) => {
    if (palettePreset === presetId) {
      setDetailsOpen((open) => !open);
    } else {
      onPresetChange(presetId);
      setDetailsOpen(true);
    }
  };

  const handleCustomClick = () => {
    if (isCustom) {
      setDetailsOpen((open) => !open);
    } else {
      startCustomFromPreset();
    }
  };

  const detailsTitle = isCustom
    ? "Make your own"
    : (selectedPreset?.name ?? "Palette");

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
        <span className="text-xs text-muted-foreground">
          Each palette includes {COLOR_COUNT} colors for light &amp; dark
        </span>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium">Color palettes</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOREFRONT_PALETTE_PRESETS.map((preset) => {
            const swatch = colorMode === "dark" ? preset.dark : preset.light;
            const selected = palettePreset === preset.id;
            const expanded = selected && detailsOpen;
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
                <div className="mb-3 flex flex-wrap gap-1">
                  {[swatch.background, swatch.primary, swatch.secondary, swatch.accent].map((c, i) => (
                    <ColorSwatch key={i} value={c} size="sm" />
                  ))}
                  <span className="ml-1 self-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{COLOR_COUNT - 4}
                  </span>
                </div>
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{preset.description}</p>
                <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  {expanded ? (
                    <>
                      <ChevronUp className="h-3 w-3" /> Hide colors
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" /> View all {COLOR_COUNT} colors
                    </>
                  )}
                </p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleCustomClick}
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
            <p className="mt-0.5 text-xs text-muted-foreground">
              Start from selected palette, edit all {COLOR_COUNT} colors
            </p>
            <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              {isCustom && detailsOpen ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Hide editor
                </>
              ) : (
                <>
                  <Pencil className="h-3 w-3" /> Customize colors
                </>
              )}
            </p>
          </button>
        </div>
      </div>

      {detailsOpen && (
        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{detailsTitle}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isCustom
                  ? `Editing ${colorMode} mode — changes apply to your storefront`
                  : `${selectedPreset?.description ?? ""} · ${colorMode} mode · ${COLOR_COUNT} tokens`}
              </p>
            </div>
            {!isCustom && selectedPreset && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => startCustomFromPreset(selectedPreset.id)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Customize this palette
              </Button>
            )}
          </div>

          <PaletteColorGrid
            palette={preview}
            editable={isCustom}
            colorMode={colorMode}
            customColors={customColors}
            onCustomColorChange={isCustom ? handleCustomColorChange : undefined}
          />
        </div>
      )}

      {/* Live preview strip */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor: preview.background,
          color: preview.foreground,
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ backgroundColor: preview.navbar, color: preview.navbarForeground }}
        >
          <span className="text-xs font-medium">Navbar preview</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px]"
            style={{ backgroundColor: preview.secondary, color: preview.secondaryForeground }}
          >
            Sale
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: preview.card,
              color: preview.cardForeground,
              border: `1px solid ${preview.border}`,
            }}
          >
            <p className="text-xs opacity-60">Product card</p>
            <p className="mt-1 text-sm font-medium">Sample item</p>
            <button
              type="button"
              className="mt-2 rounded-full px-3 py-1 text-xs"
              style={{ backgroundColor: preview.primary, color: preview.primaryForeground }}
            >
              Add to cart
            </button>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: preview.surface, color: preview.surfaceForeground }}
          >
            <p className="text-xs" style={{ color: preview.mutedForeground }}>
              Muted text
            </p>
            <p className="mt-1 text-sm" style={{ color: preview.accent }}>
              Accent highlight
            </p>
            <p className="mt-1 text-xs" style={{ color: preview.success }}>
              −10% discount
            </p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: preview.footer, color: preview.footerForeground }}
          >
            <p className="text-xs">Footer area</p>
            <p className="mt-1 text-xs" style={{ color: preview.rating }}>
              ★★★★★ Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
