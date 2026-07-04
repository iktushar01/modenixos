"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";
import { Button } from "@/components/ui/button";

interface StoreHeroProps {
  store: Store;
  theme: StorefrontThemeConfig;
}

export function StoreHero({ store, theme }: StoreHeroProps) {
  const base = `/store/${store.slug}`;

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {store.banner ? (
        <Image src={store.banner} alt="" fill priority className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 md:px-6 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3" style={{ color: theme.secondaryColor }} />
            New Season
          </motion.div>
          <h1 className="text-4xl font-light leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {theme.heroHeadline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            {theme.heroSubtext}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-8 text-sm font-medium text-black"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Link href={`${base}#shop`}>
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/30 bg-white/5 px-8 text-sm text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href={`${base}#collections`}>Explore</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
