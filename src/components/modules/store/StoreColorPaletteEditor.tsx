"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  RefreshCw,
  Sun,
  Moon,
  Pencil,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  STOREFRONT_COLOR_FIELDS,
  STOREFRONT_COLOR_PAIRS,
  STOREFRONT_PALETTE_PRESETS,
  StorefrontBrandColors,
  StorefrontColorMode,
  StorefrontColorPalette,
  contrastLabel,
  getPresetBrandSeed,
  harmonizePalette,
  harmonizePair,
  mergePalette,
  getPresetById,
  parseColor,
  regenerateFromBrand,
  resolvePresetPalette,
  validatePalette,
  withAlpha,
  colorToHex,
} from "@/lib/storefront";

interface StoreColorPaletteEditorProps {
  defaultColorMode: StorefrontColorMode;
  previewMode: StorefrontColorMode;
  palettePreset: string;
  brandColors: StorefrontBrandColors;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  onDefaultColorModeChange: (mode: StorefrontColorMode) => void;
  onPreviewModeChange: (mode: StorefrontColorMode) => void;
  onPresetChange: (presetId: string) => void;
  onBrandColorsChange: (colors: StorefrontBrandColors) => void;
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

function ContrastBadge({ bg, fg, ui }: { bg: string; fg: string; ui?: boolean }) {
  const label = contrastLabel(bg, fg);
  const pass = label === "AA" || label === "AAA" || (ui && label === "UI");
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-semibold",
        pass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
      )}
    >
      {pass ? "AA" : "Fail"}
    </span>
  );
}

function DualPreviewStrip({ light, dark }: { light: StorefrontColorPalette; dark: StorefrontColorPalette }) {
  const renderMode = (palette: StorefrontColorPalette, label: string) => (
    <div
      className="flex-1 overflow-hidden rounded-lg border"
      style={{ backgroundColor: palette.background, color: palette.foreground }}
    >
      <p className="border-b px-2 py-1 text-[10px] font-medium opacity-70">{label}</p>
      <div
        className="flex items-center justify-between px-3 py-1.5 text-[10px]"
        style={{ backgroundColor: palette.navbar, color: palette.navbarForeground }}
      >
        <span>Navbar</span>
        <span
          className="rounded-full px-1.5 py-0.5"
          style={{ backgroundColor: palette.secondary, color: palette.secondaryForeground }}
        >
          Sale
        </span>
      </div>
      <div className="space-y-2 p-2">
        <div
          className="rounded-md p-2"
          style={{
            backgroundColor: palette.card,
            color: palette.cardForeground,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p className="text-[10px] font-medium">Product</p>
          <div className="mt-1 flex gap-1">
            <span
              className="rounded-full px-2 py-0.5 text-[9px]"
              style={{ backgroundColor: palette.primary, color: palette.primaryForeground }}
            >
              M
            </span>
            <button
              type="button"
              className="rounded-full px-2 py-0.5 text-[9px]"
              style={{ backgroundColor: palette.primary, color: palette.primaryForeground }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {renderMode(light, "Light preview")}
      {renderMode(dark, "Dark preview")}
    </div>
  );
}

function RgbaColorInput({
  value,
  onChange,
  label,
}: {
  value: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const parsed = parseColor(value);
  const isRgba = value.startsWith("rgba") || (parsed && parsed.a < 1);
  const baseHex = isRgba && parsed ? colorToHex(value) : value.startsWith("rgba") ? "#000000" : value;
  const alpha = parsed?.a ?? 1;

  if (!isRgba) {
    return (
      <div className="flex items-center gap-2">
        <ColorSwatch value={value} size="sm" />
        <Input
          type="color"
          value={baseHex.startsWith("#") ? baseHex : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer p-0.5"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 flex-1 font-mono text-[11px]" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ColorSwatch value={value} size="sm" />
        <Input
          type="color"
          value={baseHex.startsWith("#") ? baseHex : "#000000"}
          onChange={(e) => onChange(withAlpha(e.target.value, alpha))}
          className="h-8 w-10 cursor-pointer p-0.5"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 flex-1 font-mono text-[11px]" />
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-[10px] text-muted-foreground">{label} opacity</Label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(alpha * 100)}
          onChange={(e) => onChange(withAlpha(baseHex, Number(e.target.value) / 100))}
          className="flex-1"
        />
        <span className="w-8 text-[10px] text-muted-foreground">{Math.round(alpha * 100)}%</span>
      </div>
    </div>
  );
}

function AdvancedPairEditor({
  palette,
  previewMode,
  customColors,
  onCustomColorChange,
  onAutoFixPair,
  onAutoFixGroup,
}: {
  palette: StorefrontColorPalette;
  previewMode: StorefrontColorMode;
  customColors?: Partial<Record<StorefrontColorMode, Partial<StorefrontColorPalette>>>;
  onCustomColorChange: (key: keyof StorefrontColorPalette, value: string) => void;
  onAutoFixPair: (bg: keyof StorefrontColorPalette, fg: keyof StorefrontColorPalette) => void;
  onAutoFixGroup: (group: string) => void;
}) {
  const grouped = useMemo(() => {
    const groups: Record<string, typeof STOREFRONT_COLOR_PAIRS> = {};
    for (const pair of STOREFRONT_COLOR_PAIRS) {
      if (!groups[pair.group]) groups[pair.group] = [];
      groups[pair.group].push(pair);
    }
    return groups;
  }, []);

  const standaloneFields = STOREFRONT_COLOR_FIELDS.filter(
    (f) => !STOREFRONT_COLOR_PAIRS.some((p) => p.bg === f.key || p.fg === f.key),
  );

  const standaloneGrouped = useMemo(() => {
    const groups: Record<string, typeof standaloneFields> = {};
    for (const field of standaloneFields) {
      if (!groups[field.group]) groups[field.group] = [];
      groups[field.group].push(field);
    }
    return groups;
  }, [standaloneFields]);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([group, pairs]) => (
        <div key={group}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
            <Button type="button" size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => onAutoFixGroup(group)}>
              <Wand2 className="h-3 w-3" />
              Auto-fix
            </Button>
          </div>
          <div className="space-y-2">
            {pairs.map((pair) => {
              const bg =
                (customColors?.[previewMode]?.[pair.bg] as string | undefined) ?? palette[pair.bg];
              const fg =
                (customColors?.[previewMode]?.[pair.fg] as string | undefined) ?? palette[pair.fg];
              const fail = contrastLabel(bg, fg) === "Fail" && !(pair.ui && contrastLabel(bg, fg) === "UI");
              return (
                <div
                  key={`${pair.bg}-${pair.fg}`}
                  className={cn(
                    "rounded-lg border bg-background p-3",
                    fail && "border-red-300 ring-1 ring-red-200",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {pair.bgLabel} / {pair.fgLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <ContrastBadge bg={bg} fg={fg} ui={pair.ui} />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => onAutoFixPair(pair.bg, pair.fg)}
                      >
                        Fix
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[10px]">{pair.bgLabel}</Label>
                      <RgbaColorInput
                        label={pair.bgLabel}
                        value={bg}
                        onChange={(v) => onCustomColorChange(pair.bg, v)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">{pair.fgLabel}</Label>
                      <RgbaColorInput
                        label={pair.fgLabel}
                        value={fg}
                        onChange={(v) => onCustomColorChange(pair.fg, v)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {Object.entries(standaloneGrouped).map(([group, fields]) => (
        <div key={`standalone-${group}`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map(({ key, label }) => {
              const value =
                (customColors?.[previewMode]?.[key] as string | undefined) ?? palette[key];
              return (
                <div key={key} className="space-y-1 rounded-lg border bg-background p-2.5">
                  <Label className="text-xs">{label}</Label>
                  <RgbaColorInput label={label} value={value} onChange={(v) => onCustomColorChange(key, v)} />
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
  defaultColorMode,
  previewMode,
  palettePreset,
  brandColors,
  customColors,
  onDefaultColorModeChange,
  onPreviewModeChange,
  onPresetChange,
  onBrandColorsChange,
  onCustomColorsChange,
}: StoreColorPaletteEditorProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [editorTab, setEditorTab] = useState<"simple" | "advanced">("simple");

  const previewLight = useMemo(
    () => resolvePreviewPalette(palettePreset, "light", customColors),
    [palettePreset, customColors],
  );
  const previewDark = useMemo(
    () => resolvePreviewPalette(palettePreset, "dark", customColors),
    [palettePreset, customColors],
  );
  const preview = previewMode === "dark" ? previewDark : previewLight;

  const isCustom = palettePreset === "custom";
  const selectedPreset = isCustom ? null : (getPresetById(palettePreset) ?? STOREFRONT_PALETTE_PRESETS[0]);

  const validationLight = useMemo(() => validatePalette(previewLight), [previewLight]);
  const validationDark = useMemo(() => validatePalette(previewDark), [previewDark]);

  const handleCustomColorChange = (key: keyof StorefrontColorPalette, value: string) => {
    onCustomColorsChange({
      ...customColors,
      [previewMode]: {
        ...(customColors?.[previewMode] ?? {}),
        [key]: value,
      },
    });
  };

  const regenerateBothModes = (seed = brandColors) => {
    const { light, dark } = regenerateFromBrand({
      brandPrimary: seed.primary,
      brandAccent: seed.accent,
    });
    onCustomColorsChange({ light, dark });
    onPresetChange("custom");
  };

  const handleBrandChange = (field: keyof StorefrontBrandColors, value: string) => {
    const next = { ...brandColors, [field]: value };
    onBrandColorsChange(next);
    if (isCustom) {
      regenerateBothModes(next);
    }
  };

  const startCustomFromPreset = (sourcePresetId?: string) => {
    const id = sourcePresetId ?? (palettePreset === "custom" ? "classic-retail" : palettePreset);
    const preset = getPresetById(id) ?? STOREFRONT_PALETTE_PRESETS[0];
    const seed = getPresetBrandSeed(id);
    onBrandColorsChange({ primary: seed.brandPrimary, accent: seed.brandAccent });
    onCustomColorsChange({
      light: mergePalette(preset.light, undefined, "light"),
      dark: mergePalette(preset.dark, undefined, "dark"),
    });
    onPresetChange("custom");
    setDetailsOpen(true);
  };

  const handlePresetClick = (presetId: string) => {
    const seed = getPresetBrandSeed(presetId);
    onBrandColorsChange({ primary: seed.brandPrimary, accent: seed.brandAccent });
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

  const autoFixAll = () => {
    onCustomColorsChange({
      light: harmonizePalette(previewLight),
      dark: harmonizePalette(previewDark),
    });
  };

  const autoFixPair = (bg: keyof StorefrontColorPalette, fg: keyof StorefrontColorPalette) => {
    const current = previewMode === "dark" ? previewDark : previewLight;
    const fixed = harmonizePair(current, bg, fg);
    onCustomColorsChange({
      ...customColors,
      [previewMode]: {
        ...(customColors?.[previewMode] ?? {}),
        [fg]: fixed[fg],
      },
    });
  };

  const autoFixGroup = (group: string) => {
    const current = previewMode === "dark" ? previewDark : previewLight;
    let fixed = { ...current };
    for (const pair of STOREFRONT_COLOR_PAIRS.filter((p) => p.group === group)) {
      fixed = harmonizePair(fixed, pair.bg, pair.fg);
    }
    onCustomColorsChange({
      ...customColors,
      [previewMode]: {
        ...(customColors?.[previewMode] ?? {}),
        ...Object.fromEntries(
          STOREFRONT_COLOR_PAIRS.filter((p) => p.group === group).flatMap((p) => [
            [p.fg, fixed[p.fg]],
          ]),
        ),
      },
    });
  };

  const detailsTitle = isCustom ? "Make your own" : (selectedPreset?.name ?? "Palette");
  const hasValidationIssues = !validationLight.ok || !validationDark.ok;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Default storefront mode</Label>
          <p className="text-[11px] text-muted-foreground">What visitors see first</p>
          <div className="flex rounded-lg border p-1">
            <Button
              type="button"
              size="sm"
              variant={defaultColorMode === "light" ? "default" : "ghost"}
              className="gap-1.5"
              onClick={() => onDefaultColorModeChange("light")}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              type="button"
              size="sm"
              variant={defaultColorMode === "dark" ? "default" : "ghost"}
              className="gap-1.5"
              onClick={() => onDefaultColorModeChange("dark")}
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Preview mode</Label>
          <p className="text-[11px] text-muted-foreground">Edit &amp; preview without changing default</p>
          <div className="flex rounded-lg border p-1">
            <Button
              type="button"
              size="sm"
              variant={previewMode === "light" ? "default" : "ghost"}
              className="gap-1.5"
              onClick={() => onPreviewModeChange("light")}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              type="button"
              size="sm"
              variant={previewMode === "dark" ? "default" : "ghost"}
              className="gap-1.5"
              onClick={() => onPreviewModeChange("dark")}
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium">Color palettes</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOREFRONT_PALETTE_PRESETS.map((preset) => {
            const selected = palettePreset === preset.id;
            const expanded = selected && detailsOpen;
            const lightOk = validatePalette(preset.light).ok;
            const darkOk = validatePalette(preset.dark).ok;
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
                <div className="mb-2">
                  <p className="mb-1 text-[10px] text-muted-foreground">Light</p>
                  <div className="flex flex-wrap gap-1">
                    {[preset.light.background, preset.light.primary, preset.light.secondary, preset.light.accent].map(
                      (c, i) => (
                        <ColorSwatch key={`l-${i}`} value={c} size="sm" />
                      ),
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="mb-1 text-[10px] text-muted-foreground">Dark</p>
                  <div className="flex flex-wrap gap-1">
                    {[preset.dark.background, preset.dark.primary, preset.dark.secondary, preset.dark.accent].map(
                      (c, i) => (
                        <ColorSwatch key={`d-${i}`} value={c} size="sm" />
                      ),
                    )}
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-medium">{preset.name}</p>
                  {lightOk && darkOk && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800">
                      AA
                    </span>
                  )}
                </div>
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
              Brand colors + advanced token editor
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
                  ? "Adjust brand colors or fine-tune individual tokens"
                  : `${selectedPreset?.description ?? ""} · ${COLOR_COUNT} tokens per mode`}
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

          <div className="flex gap-2 border-b pb-3">
            <Button
              type="button"
              size="sm"
              variant={editorTab === "simple" ? "default" : "ghost"}
              onClick={() => setEditorTab("simple")}
            >
              Simple
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editorTab === "advanced" ? "default" : "ghost"}
              onClick={() => setEditorTab("advanced")}
            >
              Advanced
            </Button>
          </div>

          {editorTab === "simple" && (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-lg border bg-background p-4">
                  <Label htmlFor="brand-primary">Brand primary</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="brand-primary"
                      type="color"
                      value={brandColors.primary}
                      onChange={(e) => handleBrandChange("primary", e.target.value)}
                      className="h-10 w-12 cursor-pointer p-1"
                    />
                    <Input
                      value={brandColors.primary}
                      onChange={(e) => handleBrandChange("primary", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border bg-background p-4">
                  <Label htmlFor="brand-accent">Brand accent</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="brand-accent"
                      type="color"
                      value={brandColors.accent}
                      onChange={(e) => handleBrandChange("accent", e.target.value)}
                      className="h-10 w-12 cursor-pointer p-1"
                    />
                    <Input
                      value={brandColors.accent}
                      onChange={(e) => handleBrandChange("accent", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="gap-1.5" onClick={() => regenerateBothModes()}>
                  <RefreshCw className="h-4 w-4" />
                  Regenerate from brand
                </Button>
                {isCustom && hasValidationIssues && (
                  <Button type="button" variant="outline" className="gap-1.5" onClick={autoFixAll}>
                    <Wand2 className="h-4 w-4" />
                    Auto-fix all contrast
                  </Button>
                )}
              </div>

              {hasValidationIssues && isCustom && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Some color pairs don&apos;t meet WCAG AA contrast. Use Auto-fix or switch to Advanced mode.
                  </span>
                </div>
              )}

            </div>
          )}

          {editorTab === "advanced" && (
            <div className="mt-4 space-y-4">
              {!isCustom ? (
                <p className="text-sm text-muted-foreground">
                  Switch to &quot;Make your own&quot; or customize a preset to edit individual tokens.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={autoFixAll}>
                      <Wand2 className="h-3.5 w-3.5" />
                      Auto-fix all contrast
                    </Button>
                  </div>
                  <AdvancedPairEditor
                    palette={preview}
                    previewMode={previewMode}
                    customColors={customColors}
                    onCustomColorChange={handleCustomColorChange}
                    onAutoFixPair={autoFixPair}
                    onAutoFixGroup={autoFixGroup}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <DualPreviewStrip light={previewLight} dark={previewDark} />
    </div>
  );
}
