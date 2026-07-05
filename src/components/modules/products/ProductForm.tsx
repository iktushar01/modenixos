"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { ProductCustomFieldsEditor } from "./ProductCustomFieldsEditor";
import {
  createProductAction,
  updateProductAction,
  getCategoriesAction,
  getCollectionsAction,
} from "@/actions/catalog.actions";
import { productFormSchema, ProductFormValues } from "@/zod/product.validation";
import { Product } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { formatPriceSample, getCurrencyName } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { cn } from "@/lib/utils";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_PRESETS = ["Black", "White", "Navy", "Beige", "Red", "Green", "Gray"];

const defaultDetails: ProductFormValues["details"] = {
  specifications: [],
  careInstructions: [],
  colorImages: {},
  customFields: [],
  useDefaultShipping: true,
};

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
  details: defaultDetails,
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
  if (detailsForSubmit.buyingPrice === "") delete detailsForSubmit.buyingPrice;
  if (detailsForSubmit.weight === "") delete detailsForSubmit.weight;
  if (!detailsForSubmit.videoUrl) delete detailsForSubmit.videoUrl;
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
  const d = product.details;
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
      specifications: d?.specifications ?? [],
      careInstructions: d?.careInstructions ?? [],
      sizeChart: d?.sizeChart,
      deliveryOverride: d?.deliveryOverride ?? "",
      colorImages: d?.colorImages ?? {},
      shortDescription: d?.shortDescription ?? "",
      buyingPrice: d?.buyingPrice ?? "",
      productSerial: d?.productSerial ?? "",
      unitName: d?.unitName ?? "",
      warranty: d?.warranty ?? "",
      initialSoldCount: d?.initialSoldCount ?? 0,
      useDefaultShipping: d?.useDefaultShipping ?? true,
      customFields: d?.customFields ?? [],
      brand: d?.brand ?? "",
      weight: d?.weight ?? "",
      dimensions: d?.dimensions ?? {},
      condition: d?.condition ?? "NEW",
      videoUrl: d?.videoUrl ?? "",
    },
  };
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const { data: store } = useMyStore();
  const storeCurrency = store?.currency ?? "USD";
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

  const shortDescLen = values.details.shortDescription?.length ?? 0;

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

  const setDetails = (patch: Partial<ProductFormValues["details"]>) => {
    setValues((prev) => ({ ...prev, details: { ...prev.details, ...patch } }));
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

  const selectedCategory = categories.find((c) => c.id === values.categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            {mode === "edit" && (
              <p className="text-sm text-muted-foreground">Editing {product?.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/dashboard/products">
              <X className="h-4 w-4" />
              Discard
            </Link>
          </Button>
          <Button type="submit" size="sm" disabled={mutation.isPending} className="gap-1.5">
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {mode === "create" ? "Save product" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* General information */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>General information</CardTitle>
              <CardDescription>Basic product name, SEO summary, and full description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item name *</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Classic White Tee"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shortDescription">Short description (SEO &amp; data feed)</Label>
                  <span
                    className={cn(
                      "text-xs",
                      shortDescLen > 255 ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {shortDescLen}/255
                  </span>
                </div>
                <Input
                  id="shortDescription"
                  maxLength={255}
                  value={values.details.shortDescription ?? ""}
                  onChange={(e) => setDetails({ shortDescription: e.target.value })}
                  placeholder="Brief summary for search engines and product feeds"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Product description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={values.description ?? ""}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe materials, fit, and care instructions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload product images or one image per color. Add an optional video link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProductMediaSection
                mode={imageMode}
                onModeChange={handleImageModeChange}
                colors={values.colors}
                existingUrls={existingUrls}
                onExistingChange={setExistingUrls}
                newFiles={newFiles}
                onNewFilesChange={setNewFiles}
                colorImages={values.details.colorImages}
                onColorImagesChange={(map) => setDetails({ colorImages: map })}
                colorNewFiles={colorNewFiles}
                onColorNewFilesChange={setColorNewFiles}
              />
              <div className="space-y-2 border-t border-border pt-4">
                <Label htmlFor="videoUrl">Video link</Label>
                <div className="flex gap-2">
                  <Input
                    id="videoUrl"
                    type="url"
                    value={values.details.videoUrl ?? ""}
                    onChange={(e) => setDetails({ videoUrl: e.target.value })}
                    placeholder="Paste YouTube or Vimeo link"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional product video shown on the storefront product page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible sections */}
          <Accordion
            type="multiple"
            defaultValue={["pricing", "inventory", "shipping", "variants", "details"]}
            className="space-y-4"
          >
            {/* Pricing */}
            <AccordionItem value="pricing" className="rounded-xl border border-border bg-card px-4 shadow-sm">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                Pricing
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Sell / current price ({storeCurrency})</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={typeof values.discountPrice === "number" ? values.discountPrice : ""}
                      onChange={(e) =>
                        set("discountPrice", e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder={values.price ? String(values.price) : "Sale price"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Active selling price when on sale. Leave empty to use regular price.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Regular / old price ({storeCurrency}) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={values.price || ""}
                      onChange={(e) => set("price", Number(e.target.value))}
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    {salePercent !== null && (
                      <p className="text-xs text-green-600">{salePercent}% off regular price</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyingPrice">Buying price (optional)</Label>
                    <Input
                      id="buyingPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        typeof values.details.buyingPrice === "number"
                          ? values.details.buyingPrice
                          : ""
                      }
                      onChange={(e) =>
                        setDetails({
                          buyingPrice: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      placeholder="Cost price"
                    />
                    <p className="text-xs text-muted-foreground">Internal cost for profit tracking.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Inventory */}
            <AccordionItem value="inventory" className="rounded-xl border border-border bg-card px-4 shadow-sm">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                Inventory
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="productSerial">Product serial</Label>
                    <Input
                      id="productSerial"
                      value={values.details.productSerial ?? ""}
                      onChange={(e) => setDetails({ productSerial: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU / product code</Label>
                    <Input
                      id="sku"
                      value={values.sku ?? ""}
                      onChange={(e) => set("sku", e.target.value)}
                      placeholder="LT-1001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitName">Unit name</Label>
                    <Input
                      id="unitName"
                      value={values.details.unitName ?? ""}
                      onChange={(e) => setDetails({ unitName: e.target.value })}
                      placeholder="e.g. piece, set, pair"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantity (stock)</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={values.stock}
                      onChange={(e) => set("stock", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input
                      id="warranty"
                      value={values.details.warranty ?? ""}
                      onChange={(e) => setDetails({ warranty: e.target.value })}
                      placeholder="e.g. 1 year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialSoldCount">Initial sold count</Label>
                    <Input
                      id="initialSoldCount"
                      type="number"
                      min="0"
                      value={values.details.initialSoldCount ?? 0}
                      onChange={(e) =>
                        setDetails({ initialSoldCount: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping */}
            <AccordionItem value="shipping" className="rounded-xl border border-border bg-card px-4 shadow-sm">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                Shipping
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Delivery charge</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add a product-specific delivery note or use your store&apos;s default shipping
                      policy.
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <div>
                      <Label htmlFor="useDefaultShipping" className="text-sm font-medium">
                        Apply default delivery charges
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Uses the policy from Shop → Shipping settings
                      </p>
                    </div>
                    <Switch
                      id="useDefaultShipping"
                      checked={values.details.useDefaultShipping ?? true}
                      onCheckedChange={(v) => setDetails({ useDefaultShipping: v })}
                    />
                  </div>
                  {!values.details.useDefaultShipping && (
                    <div className="space-y-2">
                      <Label htmlFor="deliveryOverride">Product delivery override</Label>
                      <Textarea
                        id="deliveryOverride"
                        rows={4}
                        value={values.details.deliveryOverride ?? ""}
                        onChange={(e) => setDetails({ deliveryOverride: e.target.value })}
                        placeholder="Custom delivery info for this product"
                      />
                    </div>
                  )}
                  {values.details.useDefaultShipping && (
                    <div className="space-y-2">
                      <Label htmlFor="deliveryOverrideOptional">
                        Additional delivery note (optional)
                      </Label>
                      <Textarea
                        id="deliveryOverrideOptional"
                        rows={3}
                        value={values.details.deliveryOverride ?? ""}
                        onChange={(e) => setDetails({ deliveryOverride: e.target.value })}
                        placeholder="Extra delivery details appended to store policy"
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Variants */}
            <AccordionItem value="variants" className="rounded-xl border border-border bg-card px-4 shadow-sm">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                Product variants
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
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
                  {imageMode === "standard" && values.colors.length > 0 && existingUrls.length > 0 && (
                    <div className="space-y-3 border-t border-border pt-4">
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
                              setDetails({
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
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Product page details */}
            <AccordionItem value="details" className="rounded-xl border border-border bg-card px-4 shadow-sm">
              <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                Product details
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-6">
                  <ProductCustomFieldsEditor
                    value={values.details.customFields ?? []}
                    onChange={(customFields) => setDetails({ customFields })}
                  />
                  <TagInput
                    label="Specifications"
                    value={values.details.specifications}
                    onChange={(v) => setDetails({ specifications: v })}
                    placeholder="Add a specification and press Enter"
                  />
                  <TagInput
                    label="Care instructions"
                    value={values.details.careInstructions}
                    onChange={(v) => setDetails({ careInstructions: v })}
                    placeholder="e.g. Machine wash cold"
                  />
                  <SizeChartEditor
                    value={values.details.sizeChart}
                    onChange={(chart) => setDetails({ sizeChart: chart })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-36 lg:self-start">
          {/* Category */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedCategory ? (
                <p className="text-sm font-medium">{selectedCategory.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No assigned category</p>
              )}
              <Select
                value={values.categoryId || "none"}
                onValueChange={(v) => set("categoryId", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign category" />
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
            </CardContent>
          </Card>

          {/* Brand */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand (SEO &amp; data feed)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={values.details.brand ?? ""}
                onChange={(e) => setDetails({ brand: e.target.value })}
                placeholder="Brand name"
              />
            </CardContent>
          </Card>

          {/* Collection */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Collection</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Weight & dimensions */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Product weight &amp; dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={typeof values.details.weight === "number" ? values.details.weight : ""}
                  onChange={(e) =>
                    setDetails({ weight: e.target.value === "" ? "" : Number(e.target.value) })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={values.details.dimensions?.length ?? ""}
                    onChange={(e) =>
                      setDetails({
                        dimensions: {
                          ...values.details.dimensions,
                          length: e.target.value === "" ? undefined : Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Length"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={values.details.dimensions?.width ?? ""}
                    onChange={(e) =>
                      setDetails({
                        dimensions: {
                          ...values.details.dimensions,
                          width: e.target.value === "" ? undefined : Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Width"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={values.details.dimensions?.height ?? ""}
                    onChange={(e) =>
                      setDetails({
                        dimensions: {
                          ...values.details.dimensions,
                          height: e.target.value === "" ? undefined : Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Height"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Condition (SEO &amp; data feed)</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={values.details.condition ?? "NEW"}
                onValueChange={(v) =>
                  setDetails({ condition: v as ProductFormValues["details"]["condition"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Product status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={values.status}
                onValueChange={(v) => set("status", v as ProductFormValues["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft — hidden from storefront</SelectItem>
                  <SelectItem value="ACTIVE">Active — visible on storefront</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                Currency: {getCurrencyName(storeCurrency)} ({storeCurrency}). Example:{" "}
                {formatPriceSample(storeCurrency)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
