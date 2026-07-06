import { ProductVariantForm, VariantAttributeForm } from "@/zod/product.validation";

function variantKey(options: Record<string, string>): string {
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

export function cartesianProduct(attributes: VariantAttributeForm[]): Record<string, string>[] {
  const active = attributes.filter((a) => a.options.length > 0);
  if (active.length === 0) return [];

  return active.reduce<Record<string, string>[]>(
    (acc, attr) => {
      if (acc.length === 0) {
        return attr.options.map((opt) => ({ [attr.name]: opt }));
      }
      const next: Record<string, string>[] = [];
      for (const combo of acc) {
        for (const opt of attr.options) {
          next.push({ ...combo, [attr.name]: opt });
        }
      }
      return next;
    },
    [],
  );
}

export function formatVariantLabel(options: Record<string, string>): string {
  return Object.values(options).join(" / ");
}

export function generateVariants(
  attributes: VariantAttributeForm[],
  existing: ProductVariantForm[],
  defaults: { price: number; salePrice?: number | ""; stock: number },
): ProductVariantForm[] {
  const combos = cartesianProduct(attributes);
  const existingMap = new Map(existing.map((v) => [variantKey(v.options), v]));

  return combos.map((options) => {
    const key = variantKey(options);
    const prev = existingMap.get(key);
    if (prev) return { ...prev, options };
    return {
      id: crypto.randomUUID(),
      options,
      sku: "",
      price: defaults.price,
      salePrice: defaults.salePrice ?? "",
      stock: defaults.stock,
      image: "",
      status: "ACTIVE" as const,
    };
  });
}

/** Sync legacy sizes/colors arrays from variant attribute definitions. */
export function syncLegacySizeColor(
  attributes: VariantAttributeForm[],
): { sizes: string[]; colors: string[] } {
  const sizes =
    attributes.find((a) => a.name.toLowerCase() === "size" || a.name.toLowerCase() === "shoesize")
      ?.options ?? [];
  const colors =
    attributes.find((a) => a.name.toLowerCase() === "color")?.options ?? [];
  return { sizes, colors };
}

/** Build variant attributes from legacy sizes/colors for fashion products. */
export function legacyToVariantAttributes(
  sizes: string[],
  colors: string[],
): VariantAttributeForm[] {
  const attrs: VariantAttributeForm[] = [];
  if (sizes.length > 0) attrs.push({ name: "Size", options: sizes });
  if (colors.length > 0) attrs.push({ name: "Color", options: colors });
  return attrs;
}

export function totalVariantStock(variants: ProductVariantForm[]): number {
  return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
}
