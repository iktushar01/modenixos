export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const HEX3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const HEX6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const RGB = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function expandHex(hex: string): string {
  const m = hex.match(HEX3);
  if (!m) return hex;
  return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`;
}

export function parseColor(input: string): Rgba | null {
  const s = input.trim();
  if (!s) return null;

  const rgb = s.match(RGB);
  if (rgb) {
    return {
      r: clamp01(Number(rgb[1]) / 255) * 255,
      g: clamp01(Number(rgb[2]) / 255) * 255,
      b: clamp01(Number(rgb[3]) / 255) * 255,
      a: rgb[4] !== undefined ? clamp01(Number(rgb[4])) : 1,
    };
  }

  const hex = expandHex(s);
  const m6 = hex.match(HEX6);
  if (m6) {
    return {
      r: parseInt(m6[1], 16),
      g: parseInt(m6[2], 16),
      b: parseInt(m6[3], 16),
      a: 1,
    };
  }

  return null;
}

export function toHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.round(clamp01(n / 255) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function toRgbaString(r: number, g: number, b: number, a: number): string {
  const ri = Math.round(r);
  const gi = Math.round(g);
  const bi = Math.round(b);
  if (a >= 1) return `rgb(${ri}, ${gi}, ${bi})`;
  return `rgba(${ri}, ${gi}, ${bi}, ${Math.round(a * 100) / 100})`;
}

export function colorToHex(input: string, fallback = "#000000"): string {
  const c = parseColor(input);
  if (!c) return fallback;
  return toHex(c.r, c.g, c.b);
}

/** WCAG relative luminance (sRGB) */
export function getLuminance(input: string): number {
  const c = parseColor(input);
  if (!c) return 0;
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s, l };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = clamp01(s);
  l = clamp01(l);

  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;

  const hue2rgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return {
    r: hue2rgb(hk + 1 / 3) * 255,
    g: hue2rgb(hk) * 255,
    b: hue2rgb(hk - 1 / 3) * 255,
  };
}

export function adjustLightness(hex: string, lightness: number): string {
  const c = parseColor(hex);
  if (!c) return hex;
  const { h, s } = rgbToHsl(c.r, c.g, c.b);
  const { r, g, b } = hslToRgb(h, s, clamp01(lightness));
  return toHex(r, g, b);
}

export function getLightness(hex: string): number {
  const c = parseColor(hex);
  if (!c) return 0.5;
  return rgbToHsl(c.r, c.g, c.b).l;
}

export function withAlpha(hex: string, alpha: number): string {
  const c = parseColor(hex);
  if (!c) return hex;
  return toRgbaString(c.r, c.g, c.b, alpha);
}

export function mixHex(a: string, b: string, ratio: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return a;
  const t = clamp01(ratio);
  return toHex(
    ca.r + (cb.r - ca.r) * t,
    ca.g + (cb.g - ca.g) * t,
    ca.b + (cb.b - ca.b) * t,
  );
}
