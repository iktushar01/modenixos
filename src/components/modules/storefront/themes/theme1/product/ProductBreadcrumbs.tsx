"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category, Product, Store } from "@/types/store.types";

interface ProductBreadcrumbsProps {
  store: Store;
  product: Product;
}

export function ProductBreadcrumbs({ store, product }: ProductBreadcrumbsProps) {
  const base = `/store/${store.slug}`;
  const title = product.sku ? `${product.name} | ${product.sku}` : product.name;

  return (
    <nav className="sf-muted-fg mb-6 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
      <Link href={base} className="sf-link transition-colors hover:opacity-80">
        Home
      </Link>
      {product.category && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            href={`${base}?category=${product.category.slug}`}
            className="sf-link uppercase transition-colors hover:opacity-80"
          >
            {product.category.name}
          </Link>
        </>
      )}
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="sf-fg line-clamp-1 font-medium">{title}</span>
    </nav>
  );
}
