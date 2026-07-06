"use client";

import { Fragment, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getCategoriesAction, deleteCategoryAction } from "@/actions/catalog.actions";
import { CategoryFormDialog, CategoryThumbnail } from "./CategoryFormDialog";
import { Category } from "@/types/store.types";
import { buildCategoryTree } from "@/lib/catalog/categoryTree";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [parentForCreate, setParentForCreate] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction({ limit: 200 }),
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
        <div className="dashboard-table-shell">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tree.map((parent) => {
                const hasChildren = (parent.children?.length ?? 0) > 0;
                const isOpen = expanded[parent.id] ?? hasChildren;

                return (
                  <Fragment key={parent.id}>
                    <TableRow className="bg-muted/20">
                      <TableCell>
                        <CategoryThumbnail category={parent} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(parent.id)}
                              className="rounded p-0.5 hover:bg-muted"
                              aria-label={isOpen ? "Collapse subcategories" : "Expand subcategories"}
                            >
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <span className="inline-block w-5" />
                          )}
                          {parent.name}
                          {hasChildren && (
                            <span className="text-xs text-muted-foreground">
                              ({parent.children?.length} sub)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{parent.slug}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hidden h-8 px-2 text-xs sm:inline-flex"
                            onClick={() => openCreateSub(parent)}
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Subcategory
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden"
                            onClick={() => openCreateSub(parent)}
                            aria-label="Add subcategory"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(parent)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(parent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isOpen &&
                      parent.children?.map((child) => (
                        <TableRow key={child.id}>
                          <TableCell className="pl-8">
                            <CategoryThumbnail category={child} compact />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 pl-6">
                              <span className="text-muted-foreground">↳</span>
                              <span>{child.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{child.slug}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(child)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteId(child.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
