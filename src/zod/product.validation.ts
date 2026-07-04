import z from "zod";

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
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
