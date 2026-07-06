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
    <nav className="sf-t2-breadcrumbs mb-8">
      <StorefrontNavLink href={base}>Home</StorefrontNavLink>
      {product.category && (
        <>
          <span>/</span>
          <StorefrontNavLink href={storeCategoryPath(store.slug, product.category.slug)}>
            {product.category.name}
          </StorefrontNavLink>
        </>
      )}
      <span>/</span>
      <span className="sf-t2-breadcrumb-current">{product.name}</span>
    </nav>
  );
}
