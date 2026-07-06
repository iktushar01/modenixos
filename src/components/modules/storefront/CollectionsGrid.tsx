"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Collection } from "@/types/store.types";
import { STOREFRONT_COLLECTION_ASPECT } from "@/lib/storefront/imageAspects";
import { storeCollectionPath, storeShopPath } from "@/lib/storePaths";
import { StorefrontReveal } from "./ui/StorefrontReveal";
import {
  StorefrontCarousel,
  StorefrontCarouselHeaderAction,
  StorefrontCarouselSlide,
  StorefrontCarouselTrack,
  StorefrontSection,
  STOREFRONT_CAROUSEL_TILE_CLASS,
} from "./ui";

interface CollectionsGridProps {
  slug: string;
  collections: Collection[];
}

export function CollectionsGrid({ slug, collections }: CollectionsGridProps) {
  if (collections.length === 0) return null;

  return (
    <section id="collections" className="py-16 md:py-24">
      <StorefrontCarousel>
        <StorefrontSection
          eyebrow="Curated"
          title="Collections"
          subtitle="Handpicked edits for every occasion"
          action={
            <StorefrontCarouselHeaderAction
              viewAllHref={storeShopPath(slug)}
              itemCount={collections.length}
            />
          }
        />

        <StorefrontCarouselTrack>
          {collections.map((col, i) => (
            <StorefrontCarouselSlide key={col.id} className={STOREFRONT_CAROUSEL_TILE_CLASS}>
              <StorefrontReveal staggerIndex={i}>
                <StorefrontNavLink
                  href={storeCollectionPath(slug, col.slug)}
                  className="sf-tile-card sf-image-zoom group relative block overflow-hidden"
                  style={{ aspectRatio: `${STOREFRONT_COLLECTION_ASPECT}` }}
                >
                  {col.image ? (
                    <Image src={col.image} alt={col.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="sf-tile-placeholder absolute inset-0" />
                  )}
                  <div className="sf-image-overlay absolute inset-0 transition-all duration-500" />
                  <div className="absolute left-5 top-5 md:left-6 md:top-6">
                    <span className="sf-eyebrow sf-image-overlay-muted inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <p className="sf-display-lg sf-image-overlay-fg text-xl">{col.name}</p>
                    <p className="sf-tile-cta sf-eyebrow sf-image-overlay-muted mt-2 inline-flex items-center gap-1.5">
                      {col.isFeatured ? "Featured collection" : "Explore"}
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
