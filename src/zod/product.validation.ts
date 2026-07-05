import z from "zod";

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
  }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductDetailsFormValues = z.infer<typeof productDetailsSchema>;

export const DEFAULT_SIZE_CHART_COLUMNS = [
  "Size",
  "Waist",
  "Length",
  "Leg Opening",
  "Rise",
  "Thigh",
  "Hip",
];
