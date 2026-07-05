"use client";

import Link from "next/link";
import { Category, Product, Store } from "@/types/store.types";

interface ProductBreadcrumbsProps {
  store: Store;
  product: Product;
}

export function ProductBreadcrumbs({ store, product }: ProductBreadcrumbsProps) {
  const base = `/store/${store.slug}`;

  return (
    <nav className="sf-muted-fg mb-8 flex flex-wrap items-center gap-2 text-xs">
      <Link href={base} className="sf-eyebrow sf-link transition-opacity hover:opacity-70">
        Home
      </Link>
      {product.category && (
        <>
          <span className="opacity-40">/</span>
          <Link
            href={`${base}?category=${product.category.slug}#shop`}
            className="sf-eyebrow sf-link transition-opacity hover:opacity-70"
          >
            {product.category.name}
          </Link>
        </>
      )}
      <span className="opacity-40">/</span>
      <span className="sf-eyebrow sf-fg line-clamp-1">{product.name}</span>
    </nav>
  );
}
