import { Category } from "@/types/store.types";

function sortByOrder(a: Category, b: Category) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
}

export function buildCategoryTree(categories: Category[]): Category[] {
  const byParent = new Map<string | null, Category[]>();

  for (const category of categories) {
    const key = category.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(category);
    byParent.set(key, list);
  }

  for (const [key, list] of byParent) {
    byParent.set(key, [...list].sort(sortByOrder));
  }

  const attachChildren = (category: Category): Category => ({
    ...category,
    children: (byParent.get(category.id) ?? []).map(attachChildren),
  });

  return (byParent.get(null) ?? []).map(attachChildren);
}

export function reorderCategorySiblings(
  tree: Category[],
  parentId: string | null,
  orderedIds: string[],
): Category[] {
  if (parentId === null) {
    const byId = new Map(tree.map((c) => [c.id, c]));
    return orderedIds.map((id) => byId.get(id)).filter((c): c is Category => Boolean(c));
  }

  return tree.map((parent) => {
    if (parent.id !== parentId) return parent;
    const children = parent.children ?? [];
    const byId = new Map(children.map((c) => [c.id, c]));
    return {
      ...parent,
      children: orderedIds.map((id) => byId.get(id)).filter((c): c is Category => Boolean(c)),
    };
  });
}

export function flattenCategoryTree(tree: Category[]): Category[] {
  const result: Category[] = [];
  for (const category of tree) {
    result.push(category);
    if (category.children?.length) {
      result.push(...flattenCategoryTree(category.children));
    }
  }
  return result;
}

export type StorefrontNavItem =
  | { type: "link"; label: string; href: string }
  | {
      type: "group";
      label: string;
      href: string;
      children: Array<{ label: string; href: string }>;
    };

export function resolveCategoryFilterSlugs(categories: Category[], slug: string): Set<string> {
  const slugs = new Set<string>([slug]);
  const tree = buildCategoryTree(categories);

  for (const parent of tree) {
    if (parent.slug === slug) {
      parent.children?.forEach((child) => slugs.add(child.slug));
      return slugs;
    }
    if (parent.children?.some((child) => child.slug === slug)) {
      return slugs;
    }
  }

  return slugs;
}

export function buildStorefrontCategoryNav(
  categories: Category[],
  base: string,
): StorefrontNavItem[] {
  const tree = buildCategoryTree(categories);

  return tree.map((parent) => {
    const href = `${base}?category=${encodeURIComponent(parent.slug)}#shop`;
    const children = (parent.children ?? []).map((child) => ({
      label: child.name.toUpperCase(),
      href: `${base}?category=${encodeURIComponent(child.slug)}#shop`,
    }));

    if (children.length > 0) {
      return { type: "group" as const, label: parent.name.toUpperCase(), href, children };
    }

    return { type: "link" as const, label: parent.name.toUpperCase(), href };
  });
}
