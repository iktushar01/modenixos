"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontCTA } from "./ui";

interface BrandStoryProps {
  theme: StorefrontThemeConfig;
  slug?: string;
  brandName?: string;
}

export function BrandStory({ theme, slug, brandName }: BrandStoryProps) {
  const shopHref = slug ? storeShopPath(slug) : "/shop";
  const hasImage = Boolean(theme.brandStoryImage);
  const initial = (brandName ?? theme.brandStoryTitle ?? "B").charAt(0).toUpperCase();

  return (
    <section id="about" className="sf-section w-full py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sf-border sf-promo-panel sf-panel overflow-hidden border"
      >
        <div className="grid items-stretch lg:grid-cols-2">
          {hasImage ? (
            <div className="sf-image-zoom relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
              <Image
                src={theme.brandStoryImage!}
                alt={theme.brandStoryTitle}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--sf-bg)_40%,transparent)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[color-mix(in_srgb,var(--sf-card)_30%,transparent)]" />
            </div>
          ) : (
            <div className="sf-brand-placeholder relative flex min-h-[240px] items-center justify-center lg:min-h-[420px]">
              <span className="sf-display-lg select-none opacity-20" aria-hidden>
                {initial}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14 lg:px-14">
            <p className="sf-eyebrow">Our story</p>
            <h2 className="sf-display-lg mt-3 max-w-lg">{theme.brandStoryTitle}</h2>
            <p className="sf-muted-fg sf-body-lg mt-6 max-w-xl leading-relaxed">
              {theme.brandStoryContent}
            </p>
            <div className="mt-8">
              <StorefrontCTA href={shopHref}>Explore the collection</StorefrontCTA>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
