import type { StorefrontColorPalette } from "../types";
import { ensureForeground } from "./contrast";
import { PALETTE_PAIRS } from "./validatePalette";

export function harmonizePalette(palette: StorefrontColorPalette): StorefrontColorPalette {
  const next = { ...palette };

  for (const pair of PALETTE_PAIRS) {
    const bg = next[pair.bg];
    if (!bg) continue;
    next[pair.fg] = ensureForeground(bg, next[pair.fg]);
  }

  return next;
}

export function harmonizePair(
  palette: StorefrontColorPalette,
  bgKey: keyof StorefrontColorPalette,
  fgKey: keyof StorefrontColorPalette,
): StorefrontColorPalette {
  const bg = palette[bgKey];
  if (!bg) return palette;
  return { ...palette, [fgKey]: ensureForeground(bg, palette[fgKey]) };
}
