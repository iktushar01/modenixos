"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Collection } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefrontTheme";

interface CollectionsGridProps {
  slug: string;
  collections: Collection[];
  theme: StorefrontThemeConfig;
}

export function CollectionsGrid({ slug, collections, theme }: CollectionsGridProps) {
  if (collections.length === 0) return null;

  return (
    <section id="collections" className="sf-section w-full py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Curated</p>
          <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">Collections</h2>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collections.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={`/store/${slug}?collection=${col.slug}#shop`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
            >
              {col.image ? (
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: `linear-gradient(135deg, ${theme.secondaryColor}40, transparent)` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 60px ${theme.secondaryColor}30` }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-lg font-medium text-white">{col.name}</p>
                {col.isFeatured && (
                  <span className="mt-1 inline-block text-xs uppercase tracking-wider text-white/50">Featured</span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
