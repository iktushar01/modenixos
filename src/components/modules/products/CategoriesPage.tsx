"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tags } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
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
  getCategoriesAction,
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/actions/catalog.actions";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { Category } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";
import { CategoryViewDialog } from "./CatalogViewDialogs";
import { CategoriesSortableTable } from "./CategoriesSortableTable";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [parentForCreate, setParentForCreate] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      getCategoriesAction({ limit: 200, sortBy: "sortOrder", sortOrder: "asc" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAction,
    onSuccess: () => {
      toast.success("Category deleted");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCategoriesAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to save category order");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const categories = data?.data ?? [];
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const openCreate = () => {
    setEditing(null);
    setParentForCreate(null);
    setFormOpen(true);
  };

  const openCreateSub = (parent: Category) => {
    setEditing(null);
    setParentForCreate(parent);
    setExpanded((prev) => ({ ...prev, [parent.id]: true }));
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setParentForCreate(null);
    setFormOpen(true);
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Create top-level categories and subcategories for your storefront navigation."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
        }
      />

      {tree.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Drag the handle on the left to reorder categories and subcategories on your storefront.
        </p>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : tree.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create categories like Shirts or Pants, then add subcategories like Polo Shirt or Casual Shirt."
          actionLabel="Add category"
          onAction={openCreate}
          icon={Tags}
        />
      ) : (
        <CategoriesSortableTable
          tree={tree}
          sortable
          expanded={expanded}
          onToggleExpanded={toggleExpanded}
          onReorder={(parentId, categoryIds) => reorderMutation.mutate(categoryIds)}
          onCreateSub={openCreateSub}
          onView={setViewing}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      )}

      <CategoryViewDialog
        category={viewing}
        categories={categories}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
        onEdit={openEdit}
      />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        parentCategory={parentForCreate}
      />

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Subcategories under this category will also be deleted. Products will lose their
              category assignment.
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
