"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductAction } from "@/actions/catalog.actions";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { formatPrice } from "@/lib/currency";
import { Category, Collection, Product } from "@/types/store.types";
import { CategoryThumbnail } from "./CategoryFormDialog";
import { CollectionThumbnail } from "./CollectionFormDialog";
import { cn } from "@/lib/utils";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <DetailRow label={label}>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="font-normal">
            {item}
          </Badge>
        ))}
      </div>
    </DetailRow>
  );
}

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
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>{product?.name ?? "Product details"}</DialogTitle>
          <DialogDescription>Quick overview of catalog item information.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {isPending || !product ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-6">
              {product.images.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border bg-muted"
                    >
                      <Image src={src} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl border bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <dl className="space-y-4">
                <DetailRow label="Status">
                  <Badge variant="outline" className={statusBadgeClass(product.status)}>
                    {product.status}
                  </Badge>
                </DetailRow>
                {product.sku ? <DetailRow label="SKU">{product.sku}</DetailRow> : null}
                <DetailRow label="Price">
                  {product.discountPrice ? (
                    <span>
                      <span className="font-semibold">{formatPrice(product.discountPrice, currency)}</span>
                      <span className="ml-2 text-muted-foreground line-through">
                        {formatPrice(product.price, currency)}
                      </span>
                    </span>
                  ) : (
                    <span className="font-semibold">{formatPrice(product.price, currency)}</span>
                  )}
                </DetailRow>
                <DetailRow label="Stock">
                  <span className={cn(product.stock < 5 && "font-medium text-amber-600")}>
                    {product.stock}
                    {product.stock < 5 && product.stock > 0 ? " (low)" : ""}
                  </span>
                </DetailRow>
                <DetailRow label="Category">{product.category?.name ?? "—"}</DetailRow>
                <DetailRow label="Collection">{product.collection?.name ?? "—"}</DetailRow>
                {product.description ? (
                  <DetailRow label="Description">
                    <p className="leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  </DetailRow>
                ) : null}
                <DetailList label="Sizes" items={product.sizes} />
                <DetailList label="Colors" items={product.colors} />
                <DetailList label="Tags" items={product.tags} />
                {product.details?.shortDescription ? (
                  <DetailRow label="Short desc">{product.details.shortDescription}</DetailRow>
                ) : null}
                {product.details?.brand ? (
                  <DetailRow label="Brand">{product.details.brand}</DetailRow>
                ) : null}
                {product.createdAt ? (
                  <DetailRow label="Created">
                    {new Date(product.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </DetailRow>
                ) : null}
              </dl>
            </div>
          )}
        </DialogBody>

        <DialogFooter showCloseButton>
          {product ? (
            <Button asChild>
              <Link href={`/dashboard/products/${product.id}/edit`}>
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

type CategoryViewDialogProps = {
  category: Category | null;
  categories?: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (category: Category) => void;
};

export function CategoryViewDialog({
  category,
  categories = [],
  open,
  onOpenChange,
  onEdit,
}: CategoryViewDialogProps) {
  const parent = category?.parentId
    ? categories.find((item) => item.id === category.parentId)
    : null;
  const childCount = category?.children?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{category?.name ?? "Category details"}</DialogTitle>
          <DialogDescription>Category information for your storefront navigation.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {category ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <CategoryThumbnail category={category} />
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
              </div>

              <dl className="space-y-4">
                <DetailRow label="Type">
                  {category.parentId ? "Subcategory" : "Top-level category"}
                </DetailRow>
                {parent ? <DetailRow label="Parent">{parent.name}</DetailRow> : null}
                {!category.parentId ? (
                  <DetailRow label="Subcategories">{childCount}</DetailRow>
                ) : null}
                <DetailRow label="Slug">{category.slug}</DetailRow>
              </dl>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter showCloseButton>
          {category && onEdit ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(category);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CollectionViewDialogProps = {
  collection: Collection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (collection: Collection) => void;
};

export function CollectionViewDialog({
  collection,
  open,
  onOpenChange,
  onEdit,
}: CollectionViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{collection?.name ?? "Collection details"}</DialogTitle>
          <DialogDescription>Curated product group for your storefront.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {collection ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <CollectionThumbnail collection={collection} />
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold">{collection.name}</p>
                  <p className="text-sm text-muted-foreground">/{collection.slug}</p>
                </div>
              </div>

              <dl className="space-y-4">
                <DetailRow label="Slug">{collection.slug}</DetailRow>
                <DetailRow label="Featured">
                  {collection.isFeatured ? (
                    <Badge variant="secondary">Featured on homepage</Badge>
                  ) : (
                    "No"
                  )}
                </DetailRow>
              </dl>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter showCloseButton>
          {collection && onEdit ? (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(collection);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit collection
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
