"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/types/store.types";
import { StorefrontSection } from "./ui";

interface CategoriesGridProps {
  slug: string;
  categories: Category[];
}

export function CategoriesGrid({ slug, categories }: CategoriesGridProps) {
  if (categories.length === 0) return null;

  const featured = categories.slice(0, 4);

  return (
    <StorefrontSection
      id="categories"
      className="py-16 md:py-24"
      eyebrow="Browse by"
      title="Categories"
      subtitle="Explore our curated departments"
    >
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {featured.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={i === 0 ? "md:row-span-2" : ""}
          >
            <Link
              href={`/store/${slug}?category=${cat.slug}#shop`}
              className="sf-editorial-card sf-image-zoom group relative block overflow-hidden"
              style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}
            >
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="sf-tile-placeholder absolute inset-0" />
              )}
              <div className="sf-image-overlay absolute inset-0" />
              <div className="sf-tile-hover-glow absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <p className="sf-display-lg sf-image-overlay-fg text-2xl md:text-3xl">{cat.name}</p>
                <p className="sf-eyebrow sf-image-overlay-muted mt-2">Shop now</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </StorefrontSection>
  );
}
