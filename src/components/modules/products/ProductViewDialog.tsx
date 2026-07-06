"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Layers,
  Package,
  Pencil,
  Sparkles,
  Tag,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProductAction } from "@/actions/catalog.actions";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { formatPrice } from "@/lib/currency";
import { Product } from "@/types/store.types";
import { cn } from "@/lib/utils";

function statusBadgeClass(status: Product["status"]) {
  switch (status) {
    case "ACTIVE":
      return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400";
    case "ARCHIVED":
      return "border-muted bg-muted text-muted-foreground";
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
}

function stockLabel(stock: number) {
  if (stock <= 0) return { text: "Out of stock", className: "text-destructive" };
  if (stock < 5) return { text: `${stock} left (low)`, className: "text-amber-600 dark:text-amber-400" };
  return { text: `${stock} in stock`, className: "text-emerald-600 dark:text-emerald-400" };
}

function InfoChip({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="dashboard-panel space-y-3 p-4">
      <p className="admin-section-label">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="rounded-md px-2.5 py-1 font-normal">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function ProductViewSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function ProductViewContent({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images.length > 0 ? product.images : [];
  const stock = stockLabel(product.stock);
  const details = product.details;
  const hasVariants = Boolean(details?.enableVariants && details.variants?.length);
  const discountPercent =
    product.discountPrice && product.price > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  useEffect(() => {
    setActiveImage(0);
  }, [product.id]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/55 bg-muted shadow-sm">
          {images.length > 0 ? (
            <Image
              src={images[activeImage] ?? images[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-14 w-14 text-muted-foreground/60" />
            </div>
          )}
          {discountPercent ? (
            <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  activeImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60 opacity-75 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="dashboard-panel overflow-hidden p-0">
          <div className="bg-gradient-to-br from-primary/8 via-card to-[var(--admin-accent-soft)] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Selling price</p>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    {formatPrice(product.discountPrice ?? product.price, currency)}
                  </span>
                  {product.discountPrice ? (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(product.price, currency)}
                    </span>
                  ) : null}
                </div>
              </div>
              <Badge variant="outline" className={statusBadgeClass(product.status)}>
                {product.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-border/50 bg-border/50 sm:grid-cols-4">
            <div className="bg-card/90 p-4">
              <MetaItem label="Stock" value={<span className={stock.className}>{stock.text}</span>} />
            </div>
            <div className="bg-card/90 p-4">
              <MetaItem label="SKU" value={product.sku || "—"} />
            </div>
            <div className="bg-card/90 p-4">
              <MetaItem label="Category" value={product.category?.name ?? "—"} />
            </div>
            <div className="bg-card/90 p-4">
              <MetaItem label="Collection" value={product.collection?.name ?? "—"} />
            </div>
          </div>
        </div>

        {(product.description || details?.shortDescription) && (
          <div className="dashboard-panel space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--admin-accent-strong)]" />
              <h4 className="text-sm font-semibold">Description</h4>
            </div>
            {details?.shortDescription ? (
              <p className="text-sm font-medium text-foreground">{details.shortDescription}</p>
            ) : null}
            {product.description ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            ) : null}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoChip label="Sizes" items={product.sizes} />
          <InfoChip label="Colors" items={product.colors} />
        </div>

        {product.tags.length > 0 ? <InfoChip label="Tags" items={product.tags} /> : null}

        {hasVariants ? (
          <div className="dashboard-panel overflow-hidden p-0">
            <div className="border-b border-border/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-[var(--admin-accent-strong)]" />
                <h4 className="text-sm font-semibold">Variants</h4>
                <Badge variant="secondary" className="ml-auto">
                  {details?.variants?.length ?? 0}
                </Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Options</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details?.variants?.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">
                      {Object.values(variant.options).join(" / ") || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{variant.sku || "—"}</TableCell>
                    <TableCell>
                      {variant.salePrice
                        ? formatPrice(variant.salePrice, currency)
                        : variant.price
                          ? formatPrice(variant.price, currency)
                          : "—"}
                    </TableCell>
                    <TableCell>{variant.stock}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadgeClass(variant.status)}>
                        {variant.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {(details?.brand ||
          details?.warranty ||
          details?.condition ||
          details?.barcode ||
          product.createdAt) && (
          <div className="dashboard-panel space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Box className="size-4 text-[var(--admin-accent-strong)]" />
              <h4 className="text-sm font-semibold">Additional details</h4>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {details?.brand ? <MetaItem label="Brand" value={details.brand} /> : null}
              {details?.condition ? <MetaItem label="Condition" value={details.condition} /> : null}
              {details?.warranty ? <MetaItem label="Warranty" value={details.warranty} /> : null}
              {details?.barcode ? <MetaItem label="Barcode" value={details.barcode} /> : null}
              {product.createdAt ? (
                <MetaItem
                  label="Created"
                  value={new Date(product.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
              ) : null}
            </div>
          </div>
        )}

        {details?.specifications && details.specifications.length > 0 ? (
          <div className="dashboard-panel space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-[var(--admin-accent-strong)]" />
              <h4 className="text-sm font-semibold">Specifications</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {details.specifications.map((spec, index) => (
                <li key={`${spec}-${index}`} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {details?.careInstructions && details.careInstructions.length > 0 ? (
          <div className="dashboard-panel space-y-3 p-5">
            <div className="flex items-center gap-2">
              <Tags className="size-4 text-[var(--admin-accent-strong)]" />
              <h4 className="text-sm font-semibold">Care instructions</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {details.careInstructions.map((line, index) => (
                <li key={`${line}-${index}`} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type ProductViewDialogProps = {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: string;
};

export function ProductViewDialog({
  productId,
  open,
  onOpenChange,
  currency = "USD",
}: ProductViewDialogProps) {
  const { data: product, isPending } = useDashboardQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductAction(productId!),
    enabled: open && Boolean(productId),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="full" className="sm:max-w-5xl">
        <DialogHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            {product ? (
              <Badge variant="outline" className={statusBadgeClass(product.status)}>
                {product.status}
              </Badge>
            ) : null}
            {product?.details?.featured ? (
              <Badge variant="secondary">Featured</Badge>
            ) : null}
            {product?.sku ? (
              <Badge variant="outline" className="font-mono text-xs">
                {product.sku}
              </Badge>
            ) : null}
          </div>
          <DialogTitle className="text-xl sm:text-2xl">
            {product?.name ?? "Product details"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isPending || !product ? (
            <ProductViewSkeleton />
          ) : (
            <ProductViewContent product={product} currency={currency} />
          )}
        </DialogBody>

        <DialogFooter showCloseButton>
          {product ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/dashboard/products/${product.id}/edit`} onClick={() => onOpenChange(false)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit product
              </Link>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
