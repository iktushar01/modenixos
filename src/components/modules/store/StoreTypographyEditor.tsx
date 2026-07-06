"use client";

import { useMemo } from "react";
import { Check, Type } from "lucide-react";
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
  STOREFRONT_SITE_FONT_PRESETS,
  StorefrontTypography,
  buildGoogleFontsHref,
  buildGoogleFontsHrefForFamilies,
  buildSiteTypography,
  getSiteFont,
} from "@/lib/storefront";

interface StoreTypographyEditorProps {
  typography: StorefrontTypography;
  onTypographyChange: (typography: StorefrontTypography) => void;
}

const editorFontsHref = buildGoogleFontsHrefForFamilies([...STOREFRONT_FONT_OPTIONS]);

function FontPreview({ font }: { font: string }) {
  const href = useMemo(() => buildGoogleFontsHref(font, font), [font]);

  return (
    <div className="rounded-xl border bg-card/60 p-5">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={href} />
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
      <p className="mt-3 text-3xl leading-tight" style={{ fontFamily: `"${font}", sans-serif` }}>
        Summer Collection
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: `"${font}", sans-serif` }}>
        Headlines, navigation, product names, buttons, and body copy all use your chosen font across
        the full storefront.
      </p>
    </div>
  );
}

export function StoreTypographyEditor({
  typography,
  onTypographyChange,
}: StoreTypographyEditorProps) {
  const siteFont = getSiteFont(typography);
  const isCustom = !STOREFRONT_SITE_FONT_PRESETS.some((preset) => preset.font === siteFont);

  const handleFontSelect = (font: string) => {
    onTypographyChange(buildSiteTypography(font));
  };

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={editorFontsHref} />

      <div>
        <Label className="mb-3 block text-sm font-medium">Store font</Label>
        <p className="mb-4 text-xs text-muted-foreground">
          One font for your entire shop — homepage, product pages, cart, checkout, and policy pages.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STOREFRONT_SITE_FONT_PRESETS.map((preset) => {
            const selected = siteFont === preset.font;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleFontSelect(preset.font)}
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
                  className="mb-1 text-2xl leading-none"
                  style={{ fontFamily: `"${preset.font}", sans-serif` }}
                >
                  Aa
                </p>
                <p
                  className="mb-3 text-xs text-muted-foreground"
                  style={{ fontFamily: `"${preset.font}", sans-serif` }}
                >
                  The quick brown fox
                </p>
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
        <Label className="flex items-center gap-1.5 text-sm">
          <Type className="h-3.5 w-3.5" />
          All fonts
        </Label>
        <p className="text-[11px] text-muted-foreground">
          {isCustom ? "Custom selection" : "Or pick any font from the full library"}
        </p>
        <Select value={siteFont} onValueChange={handleFontSelect}>
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

      <FontPreview font={siteFont} />
    </div>
  );
}
