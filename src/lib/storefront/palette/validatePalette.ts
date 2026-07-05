import type { StorefrontColorPalette } from "../types";
import { getContrastRatio, meetsWcagAA } from "./contrast";

export interface PalettePair {
  bg: keyof StorefrontColorPalette;
  fg: keyof StorefrontColorPalette;
  /** UI component pair uses 3:1 threshold */
  ui?: boolean;
}

export const PALETTE_PAIRS: PalettePair[] = [
  { bg: "background", fg: "foreground" },
  { bg: "surface", fg: "surfaceForeground" },
  { bg: "primary", fg: "primaryForeground" },
  { bg: "secondary", fg: "secondaryForeground" },
  { bg: "accent", fg: "accentForeground" },
  { bg: "card", fg: "cardForeground" },
  { bg: "navbar", fg: "navbarForeground" },
  { bg: "footer", fg: "footerForeground" },
  { bg: "announcement", fg: "announcementForeground" },
  { bg: "muted", fg: "mutedForeground", ui: true },
];

export interface PaletteIssue {
  pair: PalettePair;
  bg: string;
  fg: string;
  ratio: number;
  message: string;
}

export interface ValidatePaletteResult {
  ok: boolean;
  issues: PaletteIssue[];
}

export function validatePalette(palette: StorefrontColorPalette): ValidatePaletteResult {
  const issues: PaletteIssue[] = [];

  for (const pair of PALETTE_PAIRS) {
    const bg = palette[pair.bg];
    const fg = palette[pair.fg];
    if (!bg || !fg) {
      issues.push({
        pair,
        bg: bg ?? "",
        fg: fg ?? "",
        ratio: 0,
        message: `Missing ${pair.bg} or ${pair.fg}`,
      });
      continue;
    }

    const ratio = getContrastRatio(bg, fg);
    if (!meetsWcagAA(bg, fg, pair.ui)) {
      issues.push({
        pair,
        bg,
        fg,
        ratio,
        message: `${pair.bg}/${pair.fg} contrast ${ratio.toFixed(2)}:1 (needs ${pair.ui ? "3" : "4.5"}:1)`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}
