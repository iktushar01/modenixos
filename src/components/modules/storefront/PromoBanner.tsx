"use client";

import { motion } from "framer-motion";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontCTA } from "./ui";

interface PromoBannerProps {
  slug: string;
  theme: StorefrontThemeConfig;
  fallbackText?: string;
}

export function PromoBanner({ slug, theme, fallbackText }: PromoBannerProps) {
  const text = theme.promoText || fallbackText;
  if (!theme.promoEnabled || !text) return null;

  return (
    <section className="sf-section w-full py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sf-border sf-promo-panel relative overflow-hidden rounded-none border px-8 py-10 md:px-14 md:py-14"
      >
        <div className="sf-promo-glow absolute -right-16 -top-16 h-48 w-48 rounded-full" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="sf-eyebrow">Limited edition</p>
            <p className="sf-display-lg sf-text-gradient mt-3">{text}</p>
            <p className="sf-muted-fg mt-3 text-sm">Ends soon — while supplies last</p>
          </div>
          <StorefrontCTA href={storeShopPath(slug, { sale: "true" })}>Shop the sale</StorefrontCTA>
        </div>
      </motion.div>
    </section>
  );
}
