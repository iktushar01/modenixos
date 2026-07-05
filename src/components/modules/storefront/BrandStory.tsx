"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";

interface BrandStoryProps {
  theme: StorefrontThemeConfig;
}

export function BrandStory({ theme }: BrandStoryProps) {
  return (
    <section id="about" className="sf-section w-full py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sf-border relative aspect-[4/5] overflow-hidden rounded-2xl border lg:aspect-square"
        >
          {theme.brandStoryImage ? (
            <Image src={theme.brandStoryImage} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(160deg, ${theme.colors.secondary}20, var(--sf-muted))` }}
            />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] sf-muted-fg">Our Story</p>
          <h2 className="mt-3 text-3xl font-light sf-fg md:text-4xl">{theme.brandStoryTitle}</h2>
          <p className="sf-muted-fg mt-6 text-base leading-relaxed md:text-lg">{theme.brandStoryContent}</p>
        </motion.div>
      </div>
    </section>
  );
}
