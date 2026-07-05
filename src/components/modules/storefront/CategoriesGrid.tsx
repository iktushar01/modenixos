"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/types/store.types";
import { STOREFRONT_CATEGORY_ASPECT } from "@/lib/storefront/imageAspects";
import { StorefrontSection } from "./ui";

interface CategoriesGridProps {
  slug: string;
  categories: Category[];
}

export function CategoriesGrid({ slug, categories }: CategoriesGridProps) {
  if (categories.length === 0) return null;

  return (
    <StorefrontSection
      id="categories"
      className="py-16 md:py-24"
      eyebrow="Browse by"
      title="Categories"
      subtitle="Explore our curated departments"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.32) }}
          >
            <Link
              href={`/store/${slug}?category=${cat.slug}#shop`}
              className="sf-editorial-card sf-image-zoom group relative block w-full overflow-hidden"
              style={{ aspectRatio: `${STOREFRONT_CATEGORY_ASPECT}` }}
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="sf-tile-placeholder absolute inset-0" />
              )}
              <div className="sf-image-overlay absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <p className="sf-display-lg sf-image-overlay-fg text-base md:text-lg">{cat.name}</p>
                <p className="sf-eyebrow sf-image-overlay-muted mt-1.5">Shop now</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </StorefrontSection>
  );
}
