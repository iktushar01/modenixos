"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { Collection } from "@/types/store.types";
import { STOREFRONT_COLLECTION_ASPECT } from "@/lib/storefront/imageAspects";
import { storeCollectionPath, storeShopPath } from "@/lib/storePaths";
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
              <StorefrontNavLink
                  href={storeCollectionPath(slug, col.slug)}
                  className="sf-editorial-card sf-image-zoom group relative block overflow-hidden"
                  style={{ aspectRatio: `${STOREFRONT_COLLECTION_ASPECT}` }}
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
                </StorefrontNavLink>
            </StorefrontCarouselSlide>
          ))}
        </StorefrontCarouselTrack>
      </StorefrontCarousel>
    </section>
  );
}
