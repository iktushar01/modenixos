"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, X, ChevronRight } from "lucide-react";
import { Category, Collection } from "@/types/store.types";
import { ShopFacets, ShopFilters } from "@/lib/shopFilters";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { formatPrice } from "@/lib/storefrontTheme";
import { storeShopPath } from "@/lib/storePaths";
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
    <div className="sf-border border-b border-dashed pb-5 last:border-0 last:pb-0">
      <p className="sf-eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-all duration-200",
        active
          ? "sf-primary font-medium shadow-sm"
          : "sf-muted-fg hover:sf-surface hover:sf-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

function DebouncedSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = local.trim();
      if (trimmed !== (value ?? "")) {
        onChange(trimmed || undefined);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [local, onChange, value]);

  return (
    <div className="relative">
      <Search className="sf-muted-fg pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Search products..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="sf-input rounded-full pl-9 pr-9"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            onChange(undefined);
          }}
          className="sf-muted-fg absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:sf-fg"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
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
  const portalVars = useStorefrontCssVars();
  const categoryTree = buildCategoryTree(categories);

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider sf-fg">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          className="sf-muted-fg h-8 rounded-full px-3 text-xs hover:sf-fg"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>

      <div className="space-y-5">
        <FilterGroup title="Search">
          <DebouncedSearch
            value={filters.search ?? ""}
            onChange={(search) => onChange({ search })}
          />
        </FilterGroup>

        <FilterGroup title="Sort by">
          <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as ShopFilters["sort"] })}>
            <SelectTrigger className="sf-input rounded-xl">
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
              <FilterOption active={!filters.category} onClick={() => onChange({ category: undefined })}>
                All categories
              </FilterOption>
              {categoryTree.map((parent) => (
                <div key={parent.id} className="space-y-0.5">
                  <FilterOption
                    active={filters.category === parent.slug}
                    onClick={() => onChange({ category: parent.slug })}
                  >
                    {parent.image ? (
                      <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg ring-1 ring-[color-mix(in_srgb,var(--sf-border)_80%,transparent)]">
                        <Image src={parent.image} alt="" fill className="object-cover" unoptimized />
                      </span>
                    ) : (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--sf-muted)] text-[10px] font-semibold uppercase">
                        {parent.name.slice(0, 1)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate">{parent.name}</span>
                    {(parent.children?.length ?? 0) > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    )}
                  </FilterOption>
                  {parent.children?.map((child) => (
                    <FilterOption
                      key={child.id}
                      active={filters.category === child.slug}
                      onClick={() => onChange({ category: child.slug })}
                      className="ml-4"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
                      <span className="min-w-0 flex-1 truncate">{child.name}</span>
                    </FilterOption>
                  ))}
                </div>
              ))}
            </div>
          </FilterGroup>
        )}

        {collections.length > 0 && (
          <FilterGroup title="Collection">
            <div className="space-y-1">
              <FilterOption active={!filters.collection} onClick={() => onChange({ collection: undefined })}>
                All collections
              </FilterOption>
              {collections.map((col) => (
                <FilterOption
                  key={col.id}
                  active={filters.collection === col.slug}
                  onClick={() => onChange({ collection: col.slug })}
                >
                  <span className="min-w-0 flex-1 truncate">{col.name}</span>
                </FilterOption>
              ))}
            </div>
          </FilterGroup>
        )}

        <FilterGroup title="Price">
          <p className="sf-muted-fg mb-3 text-xs">
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
                className="sf-input mt-1 rounded-xl"
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
                className="sf-input mt-1 rounded-xl"
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
                    "rounded-full border px-3 py-1.5 text-xs transition-all duration-200",
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
                    "rounded-full border px-3 py-1.5 text-xs capitalize transition-all duration-200",
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
                    "rounded-full border px-3 py-1.5 text-xs capitalize transition-all duration-200",
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
          <label className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 text-sm sf-fg">
            <Checkbox
              checked={filters.sale ?? false}
              onCheckedChange={(v) => onChange({ sale: v === true ? true : undefined })}
            />
            On sale only
          </label>
        </FilterGroup>
      </div>

      <Link href={storeShopPath(slug)} className="sf-link inline-flex text-xs" onClick={onClear}>
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
          className="sf-filter-pill sf-filter-pill-active inline-flex items-center gap-1.5 !px-3 !py-1.5"
        >
          {chip.label}
          <X className="h-3 w-3 opacity-70" />
        </button>
      ))}
    </div>
  );
}
