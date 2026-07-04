"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCategoriesAction, createCategoryAction, deleteCategoryAction } from "@/actions/catalog.actions";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", name);
      return createCategoryAction(fd);
    },
    onSuccess: () => {
      toast.success("Category created");
      setName("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAction,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const categories = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your products by category."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Add Category</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={() => createMutation.mutate()} disabled={!name || createMutation.isPending}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first category to organize products." actionLabel="Add Category" onAction={() => setOpen(true)} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(cat.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
