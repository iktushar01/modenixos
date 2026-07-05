"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { StorefrontCTA } from "./ui";

interface BrandStoryProps {
  theme: StorefrontThemeConfig;
  slug?: string;
}

export function BrandStory({ theme, slug }: BrandStoryProps) {
  const shopHref = slug ? `/store/${slug}#shop` : "#shop";

  return (
    <section id="about" className="sf-section w-full py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="sf-image-zoom sf-border relative aspect-[4/5] overflow-hidden border lg:aspect-[5/6]"
        >
          {theme.brandStoryImage ? (
            <Image src={theme.brandStoryImage} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="sf-brand-placeholder absolute inset-0" />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="sf-eyebrow">Our story</p>
          <h2 className="sf-display-lg mt-3">{theme.brandStoryTitle}</h2>
          <blockquote className="sf-muted-fg sf-drop-cap sf-body-lg mt-8 border-l-2 sf-border pl-6 italic leading-relaxed">
            {theme.brandStoryContent}
          </blockquote>
          <div className="mt-10">
            <StorefrontCTA href={shopHref}>Explore the collection</StorefrontCTA>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
