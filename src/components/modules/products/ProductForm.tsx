"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductImageMode } from "./ProductMediaSection";
import {
  createProductAction,
  updateProductAction,
  getCategoriesAction,
  getCollectionsAction,
} from "@/actions/catalog.actions";
import {
  ProductFormValues,
  validateProductForm,
  resolveFormProductType,
} from "@/zod/product.validation";
import { Product } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { slugify } from "@/lib/catalog/slugify";
import {
  getProductTypeConfig,
  supportsVariants,
} from "@/lib/catalog/productCategoryConfig";
import {
  generateVariants,
  legacyToVariantAttributes,
  syncLegacySizeColor,
  totalVariantStock,
} from "@/lib/catalog/productVariants";
import { useMyStore } from "@/hooks/useMyStore";
import {
  ProductBasicInfo,
  ProductMedia,
  CategoryFields,
  ProductCategoryPicker,
  ProductPricingInventory,
  ProductOptions,
  ProductAdvanced,
  ProductFormSidebar,
} from "./form";
import type { ProductOptionMode } from "./form/ProductOptions";

const defaultDetails: ProductFormValues["details"] = {
  specifications: [],
  careInstructions: [],
  colorImages: {},
  customFields: [],
  useDefaultShipping: true,
  trackInventory: true,
  categoryAttributes: {},
  variantAttributes: [],
  variants: [],
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
  const submitValues = { ...values };

  if (submitValues.details.enableVariants) {
    const { sizes, colors } = syncLegacySizeColor(submitValues.details.variantAttributes ?? []);
    submitValues.sizes = sizes;
    submitValues.colors = colors;
    submitValues.stock = totalVariantStock(submitValues.details.variants ?? []);
  }

  const fd = new FormData();
  fd.append("name", submitValues.name);
  if (submitValues.description) fd.append("description", submitValues.description);
  fd.append("price", String(submitValues.price));
  if (typeof submitValues.discountPrice === "number" && submitValues.discountPrice > 0) {
    fd.append("discountPrice", String(submitValues.discountPrice));
  }
  if (submitValues.sku) fd.append("sku", submitValues.sku);
  fd.append("stock", String(submitValues.stock));
  fd.append("status", submitValues.status);
  if (submitValues.categoryId) fd.append("categoryId", submitValues.categoryId);
  if (submitValues.collectionId) fd.append("collectionId", submitValues.collectionId);
  fd.append("sizes", JSON.stringify(submitValues.sizes));
  fd.append("colors", JSON.stringify(submitValues.colors));
  fd.append("tags", JSON.stringify(submitValues.tags));

  const detailsForSubmit = { ...submitValues.details };
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
    const keptUrls = submitValues.colors
      .map((color) => (colorNewFiles[color] ? null : submitValues.details.colorImages[color]))
      .filter((url): url is string => Boolean(url));

    if (isEdit || keptUrls.length > 0) {
      fd.append("images", JSON.stringify(keptUrls));
    }

    submitValues.colors.forEach((color) => {
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

function resolveOptionMode(values: ProductFormValues): ProductOptionMode {
  if (values.details.enableVariants) return "variants";
  if (values.sizes.length > 0 || values.colors.length > 0) return "simple";
  return "none";
}

function productToFormValues(product: Product): ProductFormValues {
  const d = product.details;
  const enableVariants = d?.enableVariants ?? false;
  const variantAttributes =
    d?.variantAttributes ??
    (product.sizes.length > 0 || product.colors.length > 0
      ? legacyToVariantAttributes(product.sizes, product.colors)
      : []);

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
      slug: d?.slug ?? slugify(product.name),
      barcode: d?.barcode ?? "",
      metaTitle: d?.metaTitle ?? "",
      metaDescription: d?.metaDescription ?? "",
      trackInventory: d?.trackInventory ?? true,
      lowStockAlert: d?.lowStockAlert,
      featured: d?.featured ?? false,
      categoryAttributes: d?.categoryAttributes ?? {},
      enableVariants,
      variantAttributes,
      variants: d?.variants ?? [],
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
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(product?.details?.slug));
  const [optionMode, setOptionMode] = useState<ProductOptionMode>(() =>
    product ? resolveOptionMode(productToFormValues(product)) : "none",
  );

  useEffect(() => {
    if (product) {
      setValues(productToFormValues(product));
      setExistingUrls(product.images ?? []);
      setImageMode(detectImageMode(product));
      setColorNewFiles({});
      setSlugManuallyEdited(Boolean(product.details?.slug));
      setOptionMode(resolveOptionMode(productToFormValues(product)));
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
  const selectedCategory = categories.find((c) => c.id === values.categoryId);
  const productType = resolveFormProductType(values.categoryId, categories);
  const typeConfig = getProductTypeConfig(productType);
  const variantsEnabled = Boolean(values.details.enableVariants);
  const canEnableVariants = supportsVariants(productType);

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
      if (mode === "create") return createProductAction(fd);
      return updateProductAction(product!.id, fd);
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Product created" : "Product updated");
      router.push("/dashboard/products");
      router.refresh();
    },
    onError: () => toast.error("Failed to save product"),
  });

  const set = <K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const setDetails = (patch: Partial<ProductFormValues["details"]>) => {
    setValues((prev) => ({ ...prev, details: { ...prev.details, ...patch } }));
  };

  const handleNameChange = (name: string) => {
    setValues((prev) => ({
      ...prev,
      name,
      details: {
        ...prev.details,
        slug: slugManuallyEdited ? prev.details.slug : slugify(name),
      },
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    set("categoryId", categoryId);
    const nextType = resolveFormProductType(categoryId, categories);
    const nextConfig = getProductTypeConfig(nextType);
    setDetails({
      categoryAttributes: {},
      enableVariants: false,
      variantAttributes: [],
      variants: [],
    });
    setOptionMode("none");
    if (!nextConfig.features.colorImages && imageMode === "color") {
      setImageMode("standard");
    }
  };

  const handleOptionModeChange = (mode: ProductOptionMode) => {
    if (!canEnableVariants && mode === "variants") return;
    setOptionMode(mode);
    if (mode === "none") {
      handleEnableVariantsChange(false);
      setValues((prev) => ({ ...prev, sizes: [], colors: [] }));
    } else if (mode === "simple") {
      handleEnableVariantsChange(false);
    } else if (mode === "variants") {
      handleEnableVariantsChange(true);
    }
  };

  const handleEnableVariantsChange = (enabled: boolean) => {
    if (enabled) {
      const attrs =
        values.details.variantAttributes?.length > 0
          ? values.details.variantAttributes
          : legacyToVariantAttributes(values.sizes, values.colors);
      const variants = generateVariants(attrs, values.details.variants ?? [], {
        price: values.price,
        salePrice: values.discountPrice,
        stock: values.stock,
      });
      setDetails({ enableVariants: true, variantAttributes: attrs, variants });
    } else {
      const { sizes, colors } = syncLegacySizeColor(values.details.variantAttributes ?? []);
      setValues((prev) => ({
        ...prev,
        sizes: sizes.length > 0 ? sizes : prev.sizes,
        colors: colors.length > 0 ? colors : prev.colors,
        details: {
          ...prev.details,
          enableVariants: false,
          variantAttributes: [],
          variants: [],
        },
      }));
    }
  };

  const handleVariantAttributesChange = (
    variantAttributes: ProductFormValues["details"]["variantAttributes"],
  ) => {
    const variants = generateVariants(
      variantAttributes ?? [],
      values.details.variants ?? [],
      {
        price: values.price,
        salePrice: values.discountPrice,
        stock: values.stock,
      },
    );
    setDetails({ variantAttributes, variants });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateProductForm(values, productType);
    if (!result.success) {
      setErrors(result.errors);
      toast.error("Please fix the form errors");
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  const variantColors =
    optionMode === "variants"
      ? syncLegacySizeColor(values.details.variantAttributes ?? []).colors
      : values.colors;

  const previewImageUrl = existingUrls[0] ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <ProductCategoryPicker
            categoryId={values.categoryId ?? ""}
            categoryTree={categoryTree}
            selectedCategory={selectedCategory}
            productType={productType}
            onCategoryChange={handleCategoryChange}
          />

          <ProductBasicInfo
            values={values}
            errors={errors}
            onNameChange={handleNameChange}
            onShortDescriptionChange={(v) => setDetails({ shortDescription: v })}
            onDescriptionChange={(v) => set("description", v)}
            onBrandChange={(v) => setDetails({ brand: v })}
          />

          <ProductMedia
            imageMode={imageMode}
            onImageModeChange={handleImageModeChange}
            colors={variantColors}
            existingUrls={existingUrls}
            onExistingChange={setExistingUrls}
            newFiles={newFiles}
            onNewFilesChange={setNewFiles}
            colorImages={values.details.colorImages}
            onColorImagesChange={(map) => setDetails({ colorImages: map })}
            colorNewFiles={colorNewFiles}
            onColorNewFilesChange={setColorNewFiles}
            videoUrl={values.details.videoUrl ?? ""}
            onVideoUrlChange={(v) => setDetails({ videoUrl: v })}
            showColorMode={typeConfig.features.colorImages}
          />

          <ProductPricingInventory
            values={values}
            errors={errors}
            currency={storeCurrency}
            variantsEnabled={variantsEnabled}
            onPriceChange={(v) => set("price", v)}
            onDiscountPriceChange={(v) => set("discountPrice", v)}
            onCostPriceChange={(v) => setDetails({ buyingPrice: v })}
            onTrackInventoryChange={(v) => setDetails({ trackInventory: v })}
            onStockChange={(v) => set("stock", v)}
            onLowStockAlertChange={(v) => setDetails({ lowStockAlert: v })}
            onUnitNameChange={(v) => setDetails({ unitName: v })}
          />

          <ProductOptions
            mode={
              !canEnableVariants && optionMode === "variants"
                ? "simple"
                : optionMode
            }
            canEnableVariants={canEnableVariants}
            values={values}
            errors={errors}
            currency={storeCurrency}
            availableAttributes={typeConfig.variantAttributes}
            imageMode={imageMode}
            existingUrls={existingUrls}
            onModeChange={handleOptionModeChange}
            onSizesChange={(v) => set("sizes", v)}
            onColorsChange={setColors}
            onColorImagesChange={(map) => setDetails({ colorImages: map })}
            onVariantAttributesChange={handleVariantAttributesChange}
            onVariantsChange={(variants) => setDetails({ variants })}
          />

          <CategoryFields
            fields={typeConfig.categoryFields}
            values={values.details.categoryAttributes ?? {}}
            errors={errors}
            onChange={(key, value) =>
              setDetails({
                categoryAttributes: {
                  ...values.details.categoryAttributes,
                  [key]: value,
                },
              })
            }
          />

          <ProductAdvanced
            values={values}
            slugManuallyEdited={slugManuallyEdited}
            showShipping={typeConfig.features.shipping}
            showSizeChart={typeConfig.features.sizeChart}
            showCareInstructions={typeConfig.features.careInstructions}
            showWeightDimensions={typeConfig.features.weightDimensions}
            onSlugChange={(slug) => setDetails({ slug })}
            onSlugManualEdit={() => setSlugManuallyEdited(true)}
            onSkuChange={(v) => set("sku", v)}
            onBarcodeChange={(v) => setDetails({ barcode: v })}
            onProductSerialChange={(v) => setDetails({ productSerial: v })}
            onInitialSoldCountChange={(v) => setDetails({ initialSoldCount: v })}
            onMetaTitleChange={(v) => setDetails({ metaTitle: v })}
            onMetaDescriptionChange={(v) => setDetails({ metaDescription: v })}
            onTagsChange={(v) => set("tags", v)}
            onDetailsChange={setDetails}
          />
        </div>

        <ProductFormSidebar
          values={values}
          currency={storeCurrency}
          collections={collections}
          previewImageUrl={previewImageUrl}
          onCollectionChange={(v) => set("collectionId", v)}
          onStatusChange={(v) => set("status", v)}
          onFeaturedChange={(v) => setDetails({ featured: v })}
          onConditionChange={(v) => setDetails({ condition: v })}
          showCondition={typeConfig.features.condition}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[var(--sidebar-width,0px)]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2">
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
    </form>
  );
}
