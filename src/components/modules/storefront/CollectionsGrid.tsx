"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Collection } from "@/types/store.types";
import { StorefrontCTA, StorefrontSection } from "./ui";

interface CollectionsGridProps {
  slug: string;
  collections: Collection[];
}

export function CollectionsGrid({ slug, collections }: CollectionsGridProps) {
  if (collections.length === 0) return null;

  return (
    <StorefrontSection
      id="collections"
      className="py-16 md:py-24"
      eyebrow="Curated"
      title="Collections"
      subtitle="Handpicked edits for every occasion"
      action={<StorefrontCTA href={`/store/${slug}#shop`} variant="outline">View all</StorefrontCTA>}
    >
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:gap-6">
        {collections.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="w-[min(85vw,320px)] shrink-0 md:w-[360px]"
          >
            <Link
              href={`/store/${slug}?collection=${col.slug}#shop`}
              className="sf-editorial-card sf-image-zoom group relative block aspect-[3/4] overflow-hidden"
            >
              {col.image ? (
                <Image src={col.image} alt={col.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="sf-tile-placeholder absolute inset-0" />
              )}
              <div className="sf-image-overlay absolute inset-0" />
              <div className="absolute left-6 top-6">
                <span className="sf-eyebrow sf-image-overlay-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="sf-display-lg sf-image-overlay-fg text-xl">{col.name}</p>
                {col.isFeatured && (
                  <p className="sf-eyebrow sf-image-overlay-muted mt-2">Featured</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </StorefrontSection>
  );
}
