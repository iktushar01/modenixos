"use client";

import Link from "next/link";
import { storeShopPath } from "@/lib/storePaths";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Category, Collection } from "@/types/store.types";
import { ShopFacets, ShopFilters } from "@/lib/shopFilters";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { formatPrice } from "@/lib/storefrontTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStorefrontCssVars } from "./useStorefrontCssVars";

interface ShopFilterSidebarProps {
  slug: string;
  currency: string;
  filters: ShopFilters;
  facets: ShopFacets;
  categories: Category[];
  collections: Collection[];
  onChange: (patch: Partial<ShopFilters>) => void;
  onClear: () => void;
  className?: string;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sf-border border-b pb-5">
      <p className="sf-muted-fg mb-3 text-xs font-medium uppercase tracking-wider">{title}</p>
      {children}
    </div>
  );
}

export function ShopFilterSidebar({
  slug,
  currency,
  filters,
  facets,
  categories,
  collections,
  onChange,
  onClear,
  className,
}: ShopFilterSidebarProps) {
  const base = `/store/${slug}`;
  const portalVars = useStorefrontCssVars();
  const categoryTree = buildCategoryTree(categories);

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider sf-fg">Filters</h2>
        <Button variant="ghost" size="sm" className="sf-muted-fg h-8 text-xs hover:opacity-80" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <FilterGroup title="Search">
        <div className="relative">
          <Search className="sf-muted-fg absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search products..."
            value={filters.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value || undefined })}
            className="sf-input pl-9"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Sort by">
        <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as ShopFilters["sort"] })}>
          <SelectTrigger className="sf-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="storefront-theme sf-card sf-border" style={portalVars}>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </FilterGroup>

      {categories.length > 0 && (
        <FilterGroup title="Category">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onChange({ category: undefined })}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                !filters.category ? "sf-surface sf-fg" : "sf-muted-fg hover:sf-fg hover:opacity-90",
              )}
            >
              All categories
            </button>
            {categoryTree.map((parent) => (
              <div key={parent.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => onChange({ category: parent.slug })}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                    filters.category === parent.slug
                      ? "sf-surface sf-fg"
                      : "sf-muted-fg hover:sf-fg hover:opacity-90",
                  )}
                >
                  {parent.image ? (
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
                      <Image src={parent.image} alt="" fill className="object-cover" unoptimized />
                    </span>
                  ) : null}
                  {parent.name}
                </button>
                {parent.children?.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => onChange({ category: child.slug })}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg py-1.5 pl-8 pr-2 text-left text-sm transition-colors",
                      filters.category === child.slug
                        ? "sf-surface sf-fg"
                        : "sf-muted-fg hover:sf-fg hover:opacity-90",
                    )}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </FilterGroup>
      )}

      {collections.length > 0 && (
        <FilterGroup title="Collection">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onChange({ collection: undefined })}
              className={cn(
                "block w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                !filters.collection ? "sf-surface sf-fg" : "sf-muted-fg hover:opacity-90",
              )}
            >
              All collections
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => onChange({ collection: col.slug })}
                className={cn(
                  "block w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  filters.collection === col.slug ? "sf-surface sf-fg" : "sf-muted-fg hover:opacity-90",
                )}
              >
                {col.name}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        <p className="sf-muted-fg mb-2 text-xs">
          {formatPrice(facets.minPrice, currency)} – {formatPrice(facets.maxPrice, currency)}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="sf-muted-fg text-xs">Min</Label>
            <Input
              type="number"
              min={0}
              placeholder={String(facets.minPrice)}
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({ minPrice: e.target.value === "" ? undefined : Number(e.target.value) })
              }
              className="sf-input mt-1"
            />
          </div>
          <div>
            <Label className="sf-muted-fg text-xs">Max</Label>
            <Input
              type="number"
              min={0}
              placeholder={String(facets.maxPrice)}
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({ maxPrice: e.target.value === "" ? undefined : Number(e.target.value) })
              }
              className="sf-input mt-1"
            />
          </div>
        </div>
      </FilterGroup>

      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ size: filters.size === size ? undefined : size })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  filters.size === size ? "sf-filter-pill-active" : "sf-filter-pill",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.colors.length > 0 && (
        <FilterGroup title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ color: filters.color === color ? undefined : color })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  filters.color === color ? "sf-filter-pill-active" : "sf-filter-pill",
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.tags.length > 0 && (
        <FilterGroup title="Tags">
          <div className="flex flex-wrap gap-2">
            {facets.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onChange({ tag: filters.tag === tag ? undefined : tag })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                  filters.tag === tag ? "sf-filter-pill-active" : "sf-filter-pill",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Offers">
        <label className="flex cursor-pointer items-center gap-2 text-sm sf-fg">
          <Checkbox
            checked={filters.sale ?? false}
            onCheckedChange={(v) => onChange({ sale: v === true ? true : undefined })}
          />
          On sale only
        </label>
      </FilterGroup>

      <Link
        href={storeShopPath(slug)}
        className="sf-link inline-flex text-xs"
        onClick={onClear}
      >
        View full store
      </Link>
    </aside>
  );
}

/** Active filter chips shown above product grid */
export function ShopActiveFilters({
  filters,
  categories,
  collections,
  onChange,
}: {
  filters: ShopFilters;
  categories: Category[];
  collections: Collection[];
  onChange: (patch: Partial<ShopFilters>) => void;
}) {
  const chips: { label: string; clear: () => void }[] = [];

  if (filters.category) {
    const name = categories.find((c) => c.slug === filters.category)?.name ?? filters.category;
    chips.push({ label: name, clear: () => onChange({ category: undefined }) });
  }
  if (filters.collection) {
    const name = collections.find((c) => c.slug === filters.collection)?.name ?? filters.collection;
    chips.push({ label: name, clear: () => onChange({ collection: undefined }) });
  }
  if (filters.size) chips.push({ label: `Size: ${filters.size}`, clear: () => onChange({ size: undefined }) });
  if (filters.color) chips.push({ label: filters.color, clear: () => onChange({ color: undefined }) });
  if (filters.tag) chips.push({ label: `#${filters.tag}`, clear: () => onChange({ tag: undefined }) });
  if (filters.sale) chips.push({ label: "On sale", clear: () => onChange({ sale: undefined }) });
  if (filters.search) chips.push({ label: `"${filters.search}"`, clear: () => onChange({ search: undefined }) });
  if (filters.minPrice != null) chips.push({ label: `Min ${filters.minPrice}`, clear: () => onChange({ minPrice: undefined }) });
  if (filters.maxPrice != null) chips.push({ label: `Max ${filters.maxPrice}`, clear: () => onChange({ maxPrice: undefined }) });

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.clear}
          className="sf-border sf-surface inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs sf-fg hover:opacity-90"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}
