import { Category, Product } from "@/types/store.types";
import { resolveCategoryFilterSlugs } from "@/lib/catalog/categoryTree";
import { storeCategoryPath, storeShopPath } from "@/lib/storePaths";

export type ShopSort = "newest" | "price-asc" | "price-desc" | "name";

export interface ShopFilters {
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  tag?: string;
  sale?: boolean;
  sort: ShopSort;
  search?: string;
}

export interface ShopFacets {
  sizes: string[];
  colors: string[];
  tags: string[];
  minPrice: number;
  maxPrice: number;
}

export function parseShopFilters(params: URLSearchParams): ShopFilters {
  const sort = (params.get("sort") as ShopSort) || "newest";
  const min = params.get("minPrice");
  const max = params.get("maxPrice");

  return {
    category: params.get("category") ?? undefined,
    collection: params.get("collection") ?? undefined,
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
    size: params.get("size") ?? undefined,
    color: params.get("color") ?? undefined,
    tag: params.get("tag") ?? undefined,
    sale: params.get("sale") === "true",
    sort: ["newest", "price-asc", "price-desc", "name"].includes(sort) ? sort : "newest",
    search: params.get("search") ?? params.get("q") ?? undefined,
  };
}

/** Build a shop URL. Pass slug for `/store/:slug/shop`, or a full pathname to override. */
export function buildShopHref(
  slugOrPathname: string,
  params?: Record<string, string | undefined> | URLSearchParams,
): string {
  const pathname = slugOrPathname.startsWith("/store/")
    ? slugOrPathname
    : storeShopPath(slugOrPathname);

  const search =
    params instanceof URLSearchParams
      ? params
      : (() => {
          const p = new URLSearchParams();
          if (params) {
            for (const [key, value] of Object.entries(params)) {
              if (value) p.set(key, value);
            }
          }
          return p;
        })();
  const qs = search.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function buildShopCategoryHref(slug: string, categorySlug: string): string {
  return storeCategoryPath(slug, categorySlug);
}

export function shopFiltersToSearchParams(filters: ShopFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.category) p.set("category", filters.category);
  if (filters.collection) p.set("collection", filters.collection);
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) p.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) p.set("maxPrice", String(filters.maxPrice));
  if (filters.size) p.set("size", filters.size);
  if (filters.color) p.set("color", filters.color);
  if (filters.tag) p.set("tag", filters.tag);
  if (filters.sale) p.set("sale", "true");
  if (filters.sort && filters.sort !== "newest") p.set("sort", filters.sort);
  if (filters.search?.trim()) p.set("search", filters.search.trim());
  return p;
}

export function countActiveFilters(filters: ShopFilters): number {
  let n = 0;
  if (filters.category) n++;
  if (filters.collection) n++;
  if (filters.minPrice != null) n++;
  if (filters.maxPrice != null) n++;
  if (filters.size) n++;
  if (filters.color) n++;
  if (filters.tag) n++;
  if (filters.sale) n++;
  if (filters.search) n++;
  return n;
}

export function extractShopFacets(products: Product[]): ShopFacets {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const tags = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const p of products) {
    const price = p.discountPrice ?? p.price;
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
    p.sizes?.forEach((s) => sizes.add(s));
    p.colors?.forEach((c) => colors.add(c));
    p.tags?.forEach((t) => tags.add(t));
  }

  return {
    sizes: [...sizes].sort(),
    colors: [...colors].sort(),
    tags: [...tags].sort(),
    minPrice: minPrice === Infinity ? 0 : Math.floor(minPrice),
    maxPrice: maxPrice === 0 ? 500 : Math.ceil(maxPrice),
  };
}

function productPrice(p: Product) {
  return p.discountPrice ?? p.price;
}

export function filterAndSortProducts(
  products: Product[],
  filters: ShopFilters,
  categories?: Category[],
): Product[] {
  let result = [...products];

  if (filters.category) {
    const slugs = categories?.length
      ? resolveCategoryFilterSlugs(categories, filters.category)
      : new Set([filters.category]);
    result = result.filter((p) => p.category?.slug && slugs.has(p.category.slug));
  }
  if (filters.collection) {
    result = result.filter((p) => p.collection?.slug === filters.collection);
  }
  if (filters.sale) {
    result = result.filter((p) => p.discountPrice != null && p.discountPrice < p.price);
  }
  if (filters.size) {
    result = result.filter((p) => p.sizes?.includes(filters.size!));
  }
  if (filters.color) {
    result = result.filter((p) => p.colors?.includes(filters.color!));
  }
  if (filters.tag) {
    result = result.filter((p) => p.tags?.includes(filters.tag!));
  }
  if (filters.minPrice != null) {
    result = result.filter((p) => productPrice(p) >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    result = result.filter((p) => productPrice(p) <= filters.maxPrice!);
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => productPrice(a) - productPrice(b));
      break;
    case "price-desc":
      result.sort((a, b) => productPrice(b) - productPrice(a));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return result;
}

export function hasShopFilters(filters: ShopFilters): boolean {
  return countActiveFilters(filters) > 0;
}
