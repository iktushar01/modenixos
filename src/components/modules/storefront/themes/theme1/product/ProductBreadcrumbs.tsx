"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { Product, Store } from "@/types/store.types";
import { storeCategoryPath } from "@/lib/storePaths";

interface ProductBreadcrumbsProps {
  store: Store;
  product: Product;
}

export function ProductBreadcrumbs({ store, product }: ProductBreadcrumbsProps) {
  const base = `/store/${store.slug}`;

  return (
    <nav className="sf-muted-fg mb-8 flex flex-wrap items-center gap-2 text-xs">
      <StorefrontNavLink href={base} className="sf-eyebrow sf-link transition-opacity hover:opacity-70">
        Home
      </StorefrontNavLink>
      {product.category && (
        <>
          <span className="opacity-40">/</span>
          <StorefrontNavLink
            href={storeCategoryPath(store.slug, product.category.slug)}
            className="sf-eyebrow sf-link transition-opacity hover:opacity-70"
          >
            {product.category.name}
          </StorefrontNavLink>
        </>
      )}
      <span className="opacity-40">/</span>
      <span className="sf-eyebrow sf-fg line-clamp-1">{product.name}</span>
    </nav>
  );
}
