"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductMediaSection, ProductImageMode } from "./ProductMediaSection";
import { TagInput } from "./TagInput";
import { SizeChartEditor } from "./SizeChartEditor";
import {
  createProductAction,
  updateProductAction,
  getCategoriesAction,
  getCollectionsAction,
} from "@/actions/catalog.actions";
import { productFormSchema, ProductFormValues } from "@/zod/product.validation";
import { Product } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_PRESETS = ["Black", "White", "Navy", "Beige", "Red", "Green", "Gray"];

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  discountPrice: "",
  sku: "",
  stock: 0,
  status: "DRAFT",
  categoryId: "",
  collectionId: "",
  sizes: [],
  colors: [],
  tags: [],
  details: {
    specifications: [],
    careInstructions: [],
    colorImages: {},
  },
};

function buildFormData(
  values: ProductFormValues,
  existingUrls: string[],
  newFiles: File[],
  isEdit: boolean,
  imageMode: ProductImageMode,
  colorNewFiles: Record<string, File>,
): FormData {
  const fd = new FormData();
  fd.append("name", values.name);
  if (values.description) fd.append("description", values.description);
  fd.append("price", String(values.price));
  if (typeof values.discountPrice === "number" && values.discountPrice > 0) {
    fd.append("discountPrice", String(values.discountPrice));
  }
  if (values.sku) fd.append("sku", values.sku);
  fd.append("stock", String(values.stock));
  fd.append("status", values.status);
  if (values.categoryId) fd.append("categoryId", values.categoryId);
  if (values.collectionId) fd.append("collectionId", values.collectionId);
  fd.append("sizes", JSON.stringify(values.sizes));
  fd.append("colors", JSON.stringify(values.colors));
  fd.append("tags", JSON.stringify(values.tags));

  const detailsForSubmit = { ...values.details };
  if (imageMode === "color") {
    const colorImages = { ...detailsForSubmit.colorImages };
    for (const color of Object.keys(colorNewFiles)) {
      delete colorImages[color];
    }
    detailsForSubmit.colorImages = colorImages;
  }
  fd.append("details", JSON.stringify(detailsForSubmit));

  const filesToUpload: File[] = [];
  const colorImageFileMap: Record<string, number> = {};

  if (imageMode === "color") {
    const keptUrls = values.colors
      .map((color) => (colorNewFiles[color] ? null : values.details.colorImages[color]))
      .filter((url): url is string => Boolean(url));

    if (isEdit || keptUrls.length > 0) {
      fd.append("images", JSON.stringify(keptUrls));
    }

    values.colors.forEach((color) => {
      const file = colorNewFiles[color];
      if (file) {
        colorImageFileMap[color] = filesToUpload.length;
        filesToUpload.push(file);
      }
    });

    if (Object.keys(colorImageFileMap).length > 0) {
      fd.append("colorImageFileMap", JSON.stringify(colorImageFileMap));
    }
  } else {
    if (isEdit || existingUrls.length > 0) {
      fd.append("images", JSON.stringify(existingUrls));
    }
    filesToUpload.push(...newFiles);
  }

  filesToUpload.forEach((file) => fd.append("images", file));
  return fd;
}

function detectImageMode(product?: Product): ProductImageMode {
  if (!product) return "standard";
  const colorImages = product.details?.colorImages ?? {};
  const hasColorImages = product.colors.some((color) => Boolean(colorImages[color]));
  return hasColorImages ? "color" : "standard";
}

function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    discountPrice: product.discountPrice ?? "",
    sku: product.sku ?? "",
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId ?? "",
    collectionId: product.collectionId ?? "",
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    tags: product.tags ?? [],
    details: {
      specifications: product.details?.specifications ?? [],
      careInstructions: product.details?.careInstructions ?? [],
      sizeChart: product.details?.sizeChart,
      deliveryOverride: product.details?.deliveryOverride ?? "",
      colorImages: product.details?.colorImages ?? {},
    },
  };
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    product ? productToFormValues(product) : defaultValues,
  );
  const [existingUrls, setExistingUrls] = useState<string[]>(product?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [imageMode, setImageMode] = useState<ProductImageMode>(() => detectImageMode(product));
  const [colorNewFiles, setColorNewFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setValues(productToFormValues(product));
      setExistingUrls(product.images ?? []);
      setImageMode(detectImageMode(product));
      setColorNewFiles({});
    }
  }, [product]);

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction({ limit: 100 }),
  });
  const { data: collectionsRes } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollectionsAction({ limit: 100 }),
  });

  const categories = categoriesRes?.data ?? [];
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const collections = collectionsRes?.data ?? [];

  const salePercent =
    typeof values.discountPrice === "number" &&
    values.discountPrice > 0 &&
    values.discountPrice < values.price
      ? Math.round((1 - values.discountPrice / values.price) * 100)
      : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = buildFormData(
        values,
        existingUrls,
        newFiles,
        mode === "edit",
        imageMode,
        colorNewFiles,
      );
      if (mode === "create") {
        return createProductAction(fd);
      }
      return updateProductAction(product!.id, fd);
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Product created" : "Product updated");
      router.push("/dashboard/products");
      router.refresh();
    },
    onError: () => toast.error("Failed to save product"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = productFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "form";
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the form errors");
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  const set = <K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const setColors = (colors: string[]) => {
    setValues((prev) => {
      const nextColorImages = { ...prev.details.colorImages };
      for (const color of Object.keys(nextColorImages)) {
        if (!colors.includes(color)) delete nextColorImages[color];
      }
      return {
        ...prev,
        colors,
        details: { ...prev.details, colorImages: nextColorImages },
      };
    });
    setColorNewFiles((prev) => {
      const next = { ...prev };
      for (const color of Object.keys(next)) {
        if (!colors.includes(color)) delete next[color];
      }
      return next;
    });
  };

  const handleImageModeChange = (next: ProductImageMode) => {
    if (next === imageMode) return;
    if (next === "standard") {
      const merged = [...existingUrls];
      values.colors.forEach((color) => {
        const url = values.details.colorImages[color];
        if (url && !merged.includes(url)) merged.push(url);
      });
      setExistingUrls(merged);
      setColorNewFiles({});
    }
    setImageMode(next);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Add product" : "Edit product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Add images, pricing, variants, and organize your catalog."
              : `Editing ${product?.name}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product name *</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Classic White Tee"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={values.description ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe materials, fit, and care instructions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={values.sku ?? ""}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="LT-1001"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Sizes and colors shoppers can choose on the product page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TagInput
                label="Sizes"
                value={values.sizes}
                onChange={(v) => set("sizes", v)}
                placeholder="Add size and press Enter"
                presets={SIZE_PRESETS}
              />
              <TagInput
                label="Colors"
                value={values.colors}
                onChange={setColors}
                placeholder="Add color and press Enter"
                presets={COLOR_PRESETS}
              />
              <TagInput
                label="Tags"
                value={values.tags}
                onChange={(v) => set("tags", v)}
                placeholder="e.g. summer, cotton, new"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Choose standard gallery upload or upload one image per color for the storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductMediaSection
                mode={imageMode}
                onModeChange={handleImageModeChange}
                colors={values.colors}
                existingUrls={existingUrls}
                onExistingChange={setExistingUrls}
                newFiles={newFiles}
                onNewFilesChange={setNewFiles}
                colorImages={values.details.colorImages}
                onColorImagesChange={(map) =>
                  set("details", { ...values.details, colorImages: map })
                }
                colorNewFiles={colorNewFiles}
                onColorNewFilesChange={setColorNewFiles}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product page details</CardTitle>
              <CardDescription>
                Shown on the storefront Description and Delivery tabs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TagInput
                label="Specifications"
                value={values.details.specifications}
                onChange={(v) =>
                  set("details", { ...values.details, specifications: v })
                }
                placeholder="Add a specification and press Enter"
              />
              <TagInput
                label="Care instructions"
                value={values.details.careInstructions}
                onChange={(v) =>
                  set("details", { ...values.details, careInstructions: v })
                }
                placeholder="e.g. Machine wash cold"
              />
              <SizeChartEditor
                value={values.details.sizeChart}
                onChange={(chart) =>
                  set("details", { ...values.details, sizeChart: chart })
                }
              />
              <div className="space-y-2">
                <Label htmlFor="deliveryOverride">Delivery override (optional)</Label>
                <Textarea
                  id="deliveryOverride"
                  rows={4}
                  value={values.details.deliveryOverride ?? ""}
                  onChange={(e) =>
                    set("details", {
                      ...values.details,
                      deliveryOverride: e.target.value,
                    })
                  }
                  placeholder="Leave empty to use store-wide delivery policy"
                />
              </div>
              {imageMode === "standard" && values.colors.length > 0 && existingUrls.length > 0 && (
                <div className="space-y-3">
                  <Label>Color swatch images</Label>
                  <p className="text-xs text-muted-foreground">
                    Pick which product image represents each color on the product page.
                  </p>
                  {values.colors.map((color) => (
                    <div key={color} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium">{color}</span>
                      <Select
                        value={values.details.colorImages[color] || "none"}
                        onValueChange={(url) =>
                          set("details", {
                            ...values.details,
                            colorImages: {
                              ...values.details.colorImages,
                              ...(url === "none"
                                ? (() => {
                                    const next = { ...values.details.colorImages };
                                    delete next[color];
                                    return next;
                                  })()
                                : { [color]: url }),
                            },
                          })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select image" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No image</SelectItem>
                          {existingUrls.map((url, i) => (
                            <SelectItem key={url} value={url}>
                              Image {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.price || ""}
                  onChange={(e) => set("price", Number(e.target.value))}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Sale price</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeof values.discountPrice === "number" ? values.discountPrice : ""}
                  onChange={(e) =>
                    set("discountPrice", e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Optional"
                />
                {salePercent !== null && (
                  <p className="text-xs text-green-600">{salePercent}% off regular price</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={values.stock}
                  onChange={(e) => set("stock", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={values.status} onValueChange={(v) => set("status", v as ProductFormValues["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft — hidden from storefront</SelectItem>
                    <SelectItem value="ACTIVE">Active — visible on storefront</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={values.categoryId || "none"}
                  onValueChange={(v) => set("categoryId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categoryTree.map((parent) => (
                      <Fragment key={parent.id}>
                        <SelectItem value={parent.id}>{parent.name}</SelectItem>
                        {parent.children?.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            — {child.name}
                          </SelectItem>
                        ))}
                      </Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Collection</Label>
                <Select
                  value={values.collectionId || "none"}
                  onValueChange={(v) => set("collectionId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No collection</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create product" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" asChild className="w-full">
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
