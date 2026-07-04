"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCouponsAction, createCouponAction, deleteCouponAction } from "@/actions/catalog.actions";

export default function CouponsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: "", minOrder: "0" });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["coupons"], queryFn: () => getCouponsAction() });

  const createMutation = useMutation({
    mutationFn: () => createCouponAction({ ...form, value: Number(form.value), minOrder: Number(form.minOrder) }),
    onSuccess: () => {
      toast.success("Coupon created");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCouponAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const coupons = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Create discount codes for your store."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Create Coupon</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Coupon</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} /></div>
                <div><Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENT">Percentage</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Value</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
                <Button onClick={() => createMutation.mutate()} disabled={!form.code || !form.value}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      {isLoading ? <p>Loading...</p> : coupons.length === 0 ? (
        <EmptyState title="No coupons yet" description="Create discount codes to boost sales." actionLabel="Create Coupon" onAction={() => setOpen(true)} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono">{c.code}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.type === "PERCENT" ? `${c.value}%` : `$${c.value}`}</TableCell>
                <TableCell>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</TableCell>
                <TableCell><Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(c.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
