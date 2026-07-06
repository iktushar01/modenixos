"use client";

import Image from "next/image";
import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { Collection } from "@/types/store.types";
import { storeCollectionPath, storeShopPath } from "@/lib/storePaths";
import { cn } from "@/lib/utils";

interface CollectionsSectionProps {
  slug: string;
  collections: Collection[];
}

export function CollectionsSection({ slug, collections }: CollectionsSectionProps) {
  if (collections.length === 0) return null;

  return (
    <section id="collections" className="sf-t2-section sf-t2-section-muted">
      <div className="sf-section space-y-0">
        <div className="sf-t2-section-head mb-12">
          <p className="sf-t2-label">Curated edits</p>
          <h2 className="sf-t2-section-title">Collections</h2>
        </div>

        {collections.map((col, i) => (
          <StorefrontNavLink
            key={col.id}
            href={storeCollectionPath(slug, col.slug)}
            className={cn(
              "sf-t2-collection-band group grid items-center gap-6 border-t sf-border py-10 md:grid-cols-2 md:gap-12 md:py-14",
              i % 2 === 1 && "md:[&>*:first-child]:order-2",
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden sf-muted">
              {col.image ? (
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  unoptimized
                />
              ) : (
                <div className="sf-t2-collection-placeholder flex h-full items-center justify-center">
                  <span className="sf-t2-label">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
            </div>
            <div className="px-1 md:px-6">
              <p className="sf-t2-label">{col.isFeatured ? "Featured" : "Collection"}</p>
              <h3 className="sf-t2-collection-title mt-2">{col.name}</h3>
              <p className="sf-t2-collection-copy mt-3 max-w-md">
                A focused edit of pieces chosen for this season&apos;s wardrobe.
              </p>
              <span className="sf-t2-link-underline mt-6 inline-flex">Shop collection</span>
            </div>
          </StorefrontNavLink>
        ))}

        <div className="border-t sf-border pt-8 text-center">
          <StorefrontNavLink href={storeShopPath(slug)} className="sf-t2-link-underline">
            Browse full catalog
          </StorefrontNavLink>
        </div>
      </div>
    </section>
  );
}
