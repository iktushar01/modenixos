"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";

interface PromoBannerProps {
  slug: string;
  theme: StorefrontThemeConfig;
  fallbackText?: string;
}

export function PromoBanner({ slug, theme, fallbackText }: PromoBannerProps) {
  const text = theme.promoText || fallbackText;
  if (!theme.promoEnabled || !text) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-8 md:px-12 md:py-10"
        style={{
          background: `linear-gradient(135deg, ${theme.secondaryColor}25, transparent 60%), rgba(255,255,255,0.03)`,
        }}
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: `${theme.secondaryColor}30` }} />
        <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${theme.secondaryColor}30` }}
            >
              <Zap className="h-5 w-5" style={{ color: theme.secondaryColor }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Limited Time</p>
              <p className="mt-1 text-xl font-medium text-white md:text-2xl">{text}</p>
            </div>
          </div>
          <Link
            href={`/store/${slug}#shop`}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            Shop the sale
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
