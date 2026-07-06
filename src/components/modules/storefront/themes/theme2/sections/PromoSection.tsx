"use client";

import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontNavLink } from "../../../StorefrontNavLink";

interface PromoSectionProps {
  slug: string;
  theme: StorefrontThemeConfig;
  fallbackText?: string;
}

export function PromoSection({ slug, theme, fallbackText }: PromoSectionProps) {
  const text = theme.promoText || fallbackText;
  if (!theme.promoEnabled || !text) return null;

  return (
    <section className="sf-t2-promo-band">
      <div className="sf-section flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-16">
        <div className="max-w-3xl">
          <p className="sf-t2-label sf-t2-promo-label">Limited offer</p>
          <p className="sf-t2-promo-text mt-3">{text}</p>
        </div>
        <StorefrontNavLink href={storeShopPath(slug, { sale: "true" })} className="sf-t2-promo-cta">
          Shop the sale
        </StorefrontNavLink>
      </div>
    </section>
  );
}
