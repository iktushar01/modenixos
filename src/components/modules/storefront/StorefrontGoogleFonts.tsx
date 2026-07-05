"use client";

import { buildGoogleFontsHref } from "@/lib/storefront";

interface StorefrontGoogleFontsProps {
  bodyFont: string;
  displayFont: string;
}

/** Loads selected Google Fonts for the storefront shell or dashboard preview */
export function StorefrontGoogleFonts({ bodyFont, displayFont }: StorefrontGoogleFontsProps) {
  const href = buildGoogleFontsHref(bodyFont, displayFont);

  return (
    // eslint-disable-next-line @next/next/no-page-custom-font
    <link rel="stylesheet" href={href} />
  );
}
