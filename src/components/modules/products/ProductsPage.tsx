"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getProductsAction,
  deleteProductAction,
  getCategoriesAction,
  reorderProductsAction,
} from "@/actions/catalog.actions";
import { useMyStore } from "@/hooks/useMyStore";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { ProductViewDialog } from "./CatalogViewDialogs";
import { ProductsSortableTable } from "./ProductsSortableTable";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const storeCurrency = store?.currency ?? "USD";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const canReorder =
    !search.trim() && statusFilter === "all" && categoryFilter === "all";

  const queryParams: Record<string, string> = {
    limit: canReorder ? "200" : "50",
    sortBy: "sortOrder",
    sortOrder: "asc",
  };
  if (search.trim()) queryParams.searchTerm = search.trim();
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (categoryFilter !== "all") queryParams.categoryId = categoryFilter;

  const { data, isPending } = useDashboardQuery({
    queryKey: ["products", search, statusFilter, categoryFilter],
    queryFn: () => getProductsAction(queryParams),
  });

  const { data: categoriesRes } = useDashboardQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction({ limit: 100, sortBy: "sortOrder", sortOrder: "asc" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAction,
    onSuccess: () => {
      toast.success("Product deleted");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderProductsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to save product order");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const products = data?.data ?? [];
  const categories = categoriesRes?.data ?? [];

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage your catalog. Drag products to set the order shown on your storefront."
        action={
          <Button asChild size="default">
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <div className="dashboard-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {canReorder && products.length > 1 && (
        <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <GripVertical className="h-4 w-4 shrink-0" />
          Drag the handle on the left to reorder products on your storefront.
        </p>
      )}

      {!canReorder && products.length > 0 && (
        <p className="mb-3 text-sm text-muted-foreground">
          Clear search and filters to drag and reorder products.
        </p>
      )}

      <DashboardAsyncContent
        showPlaceholder={isPending && products.length === 0}
        skeleton={
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        }
      >
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first product with images, sizes, and pricing."
            actionLabel="Add product"
            actionHref="/dashboard/products/new"
            icon={Package}
          />
        ) : (
          <ProductsSortableTable
            products={products}
            currency={storeCurrency}
            sortable={canReorder}
            onReorder={(productIds) => reorderMutation.mutate(productIds)}
            onView={setViewId}
            onDelete={setDeleteId}
          />
        )}
      </DashboardAsyncContent>

      <ProductViewDialog
        productId={viewId}
        open={Boolean(viewId)}
        onOpenChange={(open) => !open && setViewId(null)}
        currency={storeCurrency}
      />

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be removed from your catalog and
              storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
