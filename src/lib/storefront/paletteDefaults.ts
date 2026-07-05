import { StorefrontColorMode, StorefrontColorPalette } from "./types";

const EXTENDED_COLORS_LIGHT = {
  overlay: "rgba(0,0,0,0.55)",
  imageOverlay: "rgba(0,0,0,0.85)",
  imageOverlayForeground: "#ffffff",
  imageOverlayMuted: "rgba(255,255,255,0.45)",
  success: "#16a34a",
  destructive: "#dc2626",
  rating: "#0f172a",
  ratingEmpty: "#71717a",
};

const EXTENDED_COLORS_DARK = {
  overlay: "rgba(0,0,0,0.72)",
  imageOverlay: "rgba(0,0,0,0.88)",
  imageOverlayForeground: "#ffffff",
  imageOverlayMuted: "rgba(255,255,255,0.45)",
  success: "#4ade80",
  destructive: "#f87171",
  rating: "#38bdf8",
  ratingEmpty: "#a3a3a3",
};

/** Ensures palettes saved before extended tokens existed still resolve completely */
export function fillPaletteDefaults(
  palette: StorefrontColorPalette,
  mode: StorefrontColorMode,
): StorefrontColorPalette {
  const ext = mode === "dark" ? EXTENDED_COLORS_DARK : EXTENDED_COLORS_LIGHT;
  return {
    ...palette,
    overlay: palette.overlay ?? ext.overlay,
    imageOverlay: palette.imageOverlay ?? ext.imageOverlay,
    imageOverlayForeground: palette.imageOverlayForeground ?? ext.imageOverlayForeground,
    imageOverlayMuted: palette.imageOverlayMuted ?? ext.imageOverlayMuted,
    success: palette.success ?? ext.success,
    destructive: palette.destructive ?? ext.destructive,
    rating: palette.rating ?? palette.accent ?? ext.rating,
    ratingEmpty: palette.ratingEmpty ?? palette.mutedForeground ?? ext.ratingEmpty,
  };
}
