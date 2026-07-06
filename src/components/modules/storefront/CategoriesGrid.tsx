"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/types/store.types";
import { STOREFRONT_CATEGORY_ASPECT } from "@/lib/storefront/imageAspects";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { storeCategoryPath, storeShopPath } from "@/lib/storePaths";
import {
  StorefrontCarousel,
  StorefrontCarouselHeaderAction,
  StorefrontCarouselSlide,
  StorefrontCarouselTrack,
  StorefrontSection,
  STOREFRONT_CAROUSEL_TILE_CLASS,
} from "./ui";

interface CategoriesGridProps {
  slug: string;
  categories: Category[];
}

export function CategoriesGrid({ slug, categories }: CategoriesGridProps) {
  const topLevel = buildCategoryTree(categories);
  if (topLevel.length === 0) return null;

  return (
    <section id="categories" className="py-16 md:py-24">
      <StorefrontCarousel>
        <StorefrontSection
          eyebrow="Browse by"
          title="Categories"
          subtitle="Explore our curated departments"
          action={
            <StorefrontCarouselHeaderAction
              viewAllHref={storeShopPath(slug)}
              itemCount={topLevel.length}
            />
          }
        />

        <StorefrontCarouselTrack>
          {topLevel.map((cat) => (
            <StorefrontCarouselSlide key={cat.id} className={STOREFRONT_CAROUSEL_TILE_CLASS}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <StorefrontNavLink
                  href={storeCategoryPath(slug, cat.slug)}
                  className="sf-editorial-card sf-image-zoom group relative block w-full overflow-hidden"
                  style={{ aspectRatio: `${STOREFRONT_CATEGORY_ASPECT}` }}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 36vw, 26vw"
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
                </StorefrontNavLink>
              </motion.div>
            </StorefrontCarouselSlide>
          ))}
        </StorefrontCarouselTrack>
      </StorefrontCarousel>
    </section>
  );
}
