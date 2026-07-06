import z from "zod";
import {
  ProductTypeKey,
  getProductTypeConfig,
  resolveProductType,
} from "@/lib/catalog/productCategoryConfig";
import { Category } from "@/types/store.types";

const sizeChartSchema = z.object({
  note: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const customFieldSchema = z.object({
  label: z.string().max(100),
  value: z.string().max(500),
});

const dimensionsSchema = z.object({
  length: z.coerce.number().positive().optional(),
  width: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
});

export const variantAttributeSchema = z.object({
  name: z.string().min(1).max(50),
  options: z.array(z.string()).default([]),
});

export const productVariantSchema = z.object({
  id: z.string(),
  options: z.record(z.string(), z.string()),
  sku: z.string().max(100).optional(),
  price: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  salePrice: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  image: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
});

const productDetailsSchema = z.object({
  specifications: z.array(z.string()).default([]),
  careInstructions: z.array(z.string()).default([]),
  sizeChart: sizeChartSchema.optional(),
  deliveryOverride: z.string().optional(),
  colorImages: z.record(z.string(), z.string()).default({}),
  shortDescription: z.string().max(255).optional(),
  buyingPrice: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  productSerial: z.string().max(100).optional(),
  unitName: z.string().max(50).optional(),
  warranty: z.string().max(200).optional(),
  initialSoldCount: z.coerce.number().int().min(0).optional(),
  useDefaultShipping: z.boolean().optional(),
  customFields: z.array(customFieldSchema).default([]),
  brand: z.string().max(100).optional(),
  weight: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  dimensions: dimensionsSchema.optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  // Universal form extensions
  slug: z.string().max(200).optional(),
  barcode: z.string().max(100).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  trackInventory: z.boolean().optional(),
  lowStockAlert: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  categoryAttributes: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  enableVariants: z.boolean().optional(),
  variantAttributes: z.array(variantAttributeSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
});

export const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.union([z.literal(""), z.coerce.number().positive()]).default(""),
  sku: z.string().max(100).optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  categoryId: z.string().optional(),
  collectionId: z.string().optional(),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  details: productDetailsSchema.default({
    specifications: [],
    careInstructions: [],
    colorImages: {},
    customFields: [],
    useDefaultShipping: true,
    categoryAttributes: {},
    variantAttributes: [],
    variants: [],
  }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductDetailsFormValues = z.infer<typeof productDetailsSchema>;
export type VariantAttributeForm = z.infer<typeof variantAttributeSchema>;
export type ProductVariantForm = z.infer<typeof productVariantSchema>;

export const DEFAULT_SIZE_CHART_COLUMNS = [
  "Size",
  "Waist",
  "Length",
  "Leg Opening",
  "Rise",
  "Thigh",
  "Hip",
];

export function validateProductForm(
  values: ProductFormValues,
  productType: ProductTypeKey,
): { success: true; data: ProductFormValues } | { success: false; errors: Record<string, string> } {
  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path.join(".") || "form";
      errors[key] = issue.message;
    });
    return { success: false, errors };
  }

  const errors: Record<string, string> = {};
  const config = getProductTypeConfig(productType);

  for (const field of config.categoryFields) {
    if (!field.required) continue;
    const val = values.details.categoryAttributes?.[field.key];
    if (val === undefined || val === "") {
      errors[`categoryAttributes.${field.key}`] = `${field.label} is required`;
    }
  }

  if (values.details.enableVariants) {
    const attrs = values.details.variantAttributes ?? [];
    if (attrs.length === 0) {
      errors["variantAttributes"] = "Add at least one variant attribute";
    }
    for (const attr of attrs) {
      if (attr.options.length === 0) {
        errors[`variantAttributes.${attr.name}`] = `Add options for ${attr.name}`;
      }
    }
    const variants = values.details.variants ?? [];
    if (variants.length === 0 && attrs.some((a) => a.options.length > 0)) {
      errors["variants"] = "No variant combinations generated";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: parsed.data };
}

export function resolveFormProductType(
  categoryId: string | undefined,
  categories: Category[],
): ProductTypeKey {
  const category = categories.find((c) => c.id === categoryId);
  return resolveProductType(category);
}
