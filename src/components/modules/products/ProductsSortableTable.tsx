"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, GripVertical, Package, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Product } from "@/types/store.types";
import { formatPrice } from "@/lib/currency";
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

interface SortableProductRowProps {
  product: Product;
  currency: string;
  sortable: boolean;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableProductRow({
  product,
  currency,
  sortable,
  onView,
  onDelete,
}: SortableProductRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    disabled: !sortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-background",
        isDragging && "z-10 opacity-90 shadow-md ring-1 ring-primary/20",
      )}
    >
      <TableCell className="w-10 p-2">
        {sortable ? (
          <button
            type="button"
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag to reorder ${product.name}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="inline-block w-9" />
        )}
      </TableCell>
      <TableCell>
        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium">{product.name}</p>
        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {product.category?.name ?? "—"}
        {product.collection?.name && (
          <span className="block text-xs">{product.collection.name}</span>
        )}
      </TableCell>
      <TableCell>
        {product.discountPrice ? (
          <div>
            <span className="font-medium">{formatPrice(product.discountPrice, currency)}</span>
            <span className="ml-1 text-xs text-muted-foreground line-through">
              {formatPrice(product.price, currency)}
            </span>
          </div>
        ) : (
          <span className="font-medium">{formatPrice(product.price, currency)}</span>
        )}
      </TableCell>
      <TableCell>
        <span className={cn(product.stock < 5 && "font-medium text-amber-600")}>
          {product.stock}
          {product.stock < 5 && product.stock > 0 && (
            <span className="ml-1 text-xs">(low)</span>
          )}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusBadgeClass(product.status)}>
          {product.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(product.id)}
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ProductsSortableTableProps {
  products: Product[];
  currency: string;
  sortable: boolean;
  onReorder: (productIds: string[]) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductsSortableTable({
  products,
  currency,
  sortable,
  onReorder,
  onView,
  onDelete,
}: ProductsSortableTableProps) {
  const [items, setItems] = useState(products);

  useEffect(() => {
    setItems(products);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onReorder(next.map((p) => p.id));
  };

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10" aria-label="Reorder" />
        <TableHead className="w-[72px]">Image</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  const rows = items.map((product) => (
    <SortableProductRow
      key={product.id}
      product={product}
      currency={currency}
      sortable={sortable}
      onView={onView}
      onDelete={onDelete}
    />
  ));

  return (
    <DashboardTable label="Catalog" count={items.length}>
      {sortable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            {tableHeader}
            <TableBody>
              <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                {rows}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      ) : (
        <Table>
          {tableHeader}
          <TableBody>{rows}</TableBody>
        </Table>
      )}
    </DashboardTable>
  );
}
