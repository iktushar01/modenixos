"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { getCollectionsAction, deleteCollectionAction } from "@/actions/catalog.actions";
import { CollectionFormDialog, CollectionThumbnail } from "./CollectionFormDialog";
import { Collection } from "@/types/store.types";
import { CollectionViewDialog } from "./CatalogViewDialogs";

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Collection | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollectionsAction({ limit: 100 }),
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
        <DashboardTable label="Collections" count={collections.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((col) => (
                <TableRow key={col.id}>
                  <TableCell>
                    <CollectionThumbnail collection={col} />
                  </TableCell>
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell className="text-muted-foreground">{col.slug}</TableCell>
                  <TableCell>{col.isFeatured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewing(col)} aria-label={`View ${col.name}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(col)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(col.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardTable>
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
