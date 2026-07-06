"use client";

import Image from "next/image";
import { StorefrontThemeConfig } from "@/lib/storefront";
import { storeShopPath } from "@/lib/storePaths";
import { StorefrontNavLink } from "../../../StorefrontNavLink";

interface BrandStorySectionProps {
  theme: StorefrontThemeConfig;
  slug?: string;
  brandName?: string;
}

export function BrandStorySection({ theme, slug, brandName }: BrandStorySectionProps) {
  const shopHref = slug ? storeShopPath(slug) : "/shop";
  const hasImage = Boolean(theme.brandStoryImage);
  const initial = (brandName ?? theme.brandStoryTitle ?? "B").charAt(0).toUpperCase();

  return (
    <section id="about" className="sf-t2-section sf-t2-section-muted">
      <div className="sf-section">
        <div className="mx-auto max-w-3xl text-center">
          <p className="sf-t2-label">About</p>
          <h2 className="sf-t2-section-title mt-3">{theme.brandStoryTitle}</h2>
          <p className="sf-t2-brand-copy mt-6">{theme.brandStoryContent}</p>
          <StorefrontNavLink href={shopHref} className="sf-t2-link-underline mt-8 inline-flex">
            Discover the collection
          </StorefrontNavLink>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          {hasImage ? (
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={theme.brandStoryImage!}
                alt={theme.brandStoryTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="sf-t2-brand-placeholder flex aspect-square items-center justify-center">
              <span className="sf-t2-section-title text-6xl opacity-20">{initial}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
