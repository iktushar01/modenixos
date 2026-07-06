"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Layers } from "lucide-react";
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
  getCollectionsAction,
  deleteCollectionAction,
  reorderCollectionsAction,
} from "@/actions/catalog.actions";
import { CollectionFormDialog } from "./CollectionFormDialog";
import { Collection } from "@/types/store.types";
import { CollectionViewDialog } from "./CatalogViewDialogs";
import { CollectionsSortableTable } from "./CollectionsSortableTable";

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Collection | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () =>
      getCollectionsAction({ limit: 100, sortBy: "sortOrder", sortOrder: "asc" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollectionAction,
    onSuccess: () => {
      toast.success("Collection deleted");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => toast.error("Failed to delete collection"),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCollectionsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => {
      toast.error("Failed to save collection order");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const collections = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (col: Collection) => {
    setEditing(col);
    setFormOpen(true);
  };

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Catalog"
        title="Collections"
        description="Group products into curated collections. Images use a 3:4 crop matching your storefront."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add collection
          </Button>
        }
      />

      {collections.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Drag the handle on the left to reorder collections on your storefront.
        </p>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Create collections like Summer, New Arrival, or Sale with cover images."
          actionLabel="Add collection"
          onAction={openCreate}
          icon={Layers}
        />
      ) : (
        <CollectionsSortableTable
          collections={collections}
          sortable
          onReorder={(collectionIds) => reorderMutation.mutate(collectionIds)}
          onView={setViewing}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      )}

      <CollectionViewDialog
        collection={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
        onEdit={openEdit}
      />

      <CollectionFormDialog open={formOpen} onOpenChange={setFormOpen} collection={editing} />

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete collection?</AlertDialogTitle>
            <AlertDialogDescription>
              Products in this collection will remain but lose their collection assignment.
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
