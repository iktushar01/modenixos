"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { Category } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { storeCategoryPath, storeShopPath } from "@/lib/storePaths";

interface CategoriesSectionProps {
  slug: string;
  categories: Category[];
}

export function CategoriesSection({ slug, categories }: CategoriesSectionProps) {
  const topLevel = buildCategoryTree(categories);
  if (topLevel.length === 0) return null;

  return (
    <section id="categories" className="sf-t2-section">
      <div className="sf-section">
        <div className="sf-t2-section-head">
          <p className="sf-t2-label">Departments</p>
          <h2 className="sf-t2-section-title">Shop by category</h2>
          <StorefrontNavLink href={storeShopPath(slug)} className="sf-t2-link-underline ml-auto hidden sm:inline-flex">
            View all
          </StorefrontNavLink>
        </div>

        <ul className="sf-t2-category-list mt-10 divide-y sf-border border-t">
          {topLevel.map((cat, index) => (
            <li key={cat.id}>
              <StorefrontNavLink
                href={storeCategoryPath(slug, cat.slug)}
                className="sf-t2-category-row group flex items-center gap-4 py-5 sm:py-6"
              >
                <span className="sf-t2-category-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="sf-t2-category-name flex-1">{cat.name}</span>
                <span className="sf-t2-category-cta opacity-0 transition-all group-hover:opacity-100">
                  Explore →
                </span>
              </StorefrontNavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
