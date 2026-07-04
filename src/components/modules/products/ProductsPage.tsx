"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getProductsAction, createProductAction, deleteProductAction, getCategoriesAction, getCollectionsAction } from "@/actions/catalog.actions";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "0", status: "DRAFT", categoryId: "", collectionId: "" });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => getProductsAction() });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => getCategoriesAction() });
  const { data: collections } = useQuery({ queryKey: ["collections"], queryFn: () => getCollectionsAction() });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      return createProductAction(fd);
    },
    onSuccess: () => {
      toast.success("Product created");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Failed to create product"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const products = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your fashion catalog."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Add Product</Button></DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>New Product</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                </div>
                <div><Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.name || !form.price}>Create Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      {isLoading ? <p>Loading...</p> : products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first product to start selling." actionLabel="Add Product" onAction={() => setOpen(true)} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
