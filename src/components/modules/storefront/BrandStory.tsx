"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";

interface BrandStoryProps {
  theme: StorefrontThemeConfig;
}

export function BrandStory({ theme }: BrandStoryProps) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:aspect-square"
        >
          {theme.brandStoryImage ? (
            <Image src={theme.brandStoryImage} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(160deg, ${theme.secondaryColor}20, #18181b)` }}
            />
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Our Story</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{theme.brandStoryTitle}</h2>
          <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">{theme.brandStoryContent}</p>
        </motion.div>
      </div>
    </section>
  );
}
