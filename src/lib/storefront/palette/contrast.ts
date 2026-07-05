import { getLuminance } from "./colorMath";

export function getContrastRatio(a: string, b: string): number {
  const l1 = getLuminance(a);
  const l2 = getLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const FG_CANDIDATES = ["#ffffff", "#fafafa", "#f5f5f5", "#0a0a0a", "#171717", "#000000"];

export function pickForeground(background: string): string {
  return ensureForeground(background);
}

export function meetsWcagAA(background: string, foreground: string, largeOrUi = false): boolean {
  const ratio = getContrastRatio(background, foreground);
  return largeOrUi ? ratio >= 3 : ratio >= 4.5;
}

export function ensureForeground(background: string, current?: string): string {
  if (current && meetsWcagAA(background, current)) return current;

  let best = FG_CANDIDATES[0];
  let bestRatio = 0;
  for (const candidate of FG_CANDIDATES) {
    const ratio = getContrastRatio(background, candidate);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }

  if (bestRatio >= 4.5) return best;
  return getLuminance(background) > 0.5 ? "#000000" : "#ffffff";
}

export function contrastLabel(background: string, foreground: string): "AAA" | "AA" | "UI" | "Fail" {
  const ratio = getContrastRatio(background, foreground);
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "UI";
  return "Fail";
}

export function ensureOnBrand(background: string): string {
  return ensureForeground(background);
}
