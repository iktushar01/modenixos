import { Category } from "@/types/store.types";

export function buildCategoryTree(categories: Category[]): Category[] {
  const byParent = new Map<string | null, Category[]>();

  for (const category of categories) {
    const key = category.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(category);
    byParent.set(key, list);
  }

  const attachChildren = (category: Category): Category => ({
    ...category,
    children: (byParent.get(category.id) ?? []).map(attachChildren),
  });

  return (byParent.get(null) ?? []).map(attachChildren);
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

export function buildStorefrontCategoryNav(
  categories: Category[],
  base: string,
): StorefrontNavItem[] {
  const tree = buildCategoryTree(categories);

  return tree.map((parent) => {
    const href = `${base}#shop?category=${encodeURIComponent(parent.slug)}`;
    const children = (parent.children ?? []).map((child) => ({
      label: child.name.toUpperCase(),
      href: `${base}#shop?category=${encodeURIComponent(child.slug)}`,
    }));

    if (children.length > 0) {
      return { type: "group" as const, label: parent.name.toUpperCase(), href, children };
    }

    return { type: "link" as const, label: parent.name.toUpperCase(), href };
  });
}
