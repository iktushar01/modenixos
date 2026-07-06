"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/store.types";
import { STOREFRONT_CATEGORY_ASPECT } from "@/lib/storefront/imageAspects";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { storeCategoryPath, storeShopPath } from "@/lib/storePaths";
import { StorefrontReveal } from "./ui/StorefrontReveal";
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
          {topLevel.map((cat, index) => (
            <StorefrontCarouselSlide key={cat.id} className={STOREFRONT_CAROUSEL_TILE_CLASS}>
              <StorefrontReveal staggerIndex={index}>
                <StorefrontNavLink
                  href={storeCategoryPath(slug, cat.slug)}
                  className="sf-tile-card sf-image-zoom group relative block w-full overflow-hidden"
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
                  <div className="sf-image-overlay absolute inset-0 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5">
                    <p className="sf-display-lg sf-image-overlay-fg text-base md:text-lg">{cat.name}</p>
                    <p className="sf-tile-cta sf-eyebrow sf-image-overlay-muted mt-2 inline-flex items-center gap-1.5">
                      Shop now
                      <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                    </p>
                  </div>
                </StorefrontNavLink>
              </StorefrontReveal>
            </StorefrontCarouselSlide>
          ))}
        </StorefrontCarouselTrack>
      </StorefrontCarousel>
    </section>
  );
}
