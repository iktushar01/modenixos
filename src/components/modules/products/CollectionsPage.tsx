"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCollectionsAction, createCollectionAction, deleteCollectionAction } from "@/actions/catalog.actions";

export default function CollectionsPage() {
  const [name, setName] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getCollectionsAction(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("isFeatured", String(isFeatured));
      return createCollectionAction(fd);
    },
    onSuccess: () => {
      toast.success("Collection created");
      setName("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollectionAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] }),
  });

  const collections = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        description="Group products into curated collections."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Add Collection</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Collection</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="flex items-center gap-2">
                  <Checkbox id="featured" checked={isFeatured} onCheckedChange={(v) => setIsFeatured(!!v)} />
                  <Label htmlFor="featured">Featured on storefront</Label>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!name}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : collections.length === 0 ? (
        <EmptyState title="No collections yet" description="Create collections like Summer, New Arrival, or Sale." actionLabel="Add Collection" onAction={() => setOpen(true)} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((col) => (
              <TableRow key={col.id}>
                <TableCell>{col.name}</TableCell>
                <TableCell>{col.slug}</TableCell>
                <TableCell>{col.isFeatured ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(col.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
