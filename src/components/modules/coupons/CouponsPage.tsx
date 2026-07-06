"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Power, Ticket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  getCouponsAction,
  updateCouponAction,
  deleteCouponAction,
} from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { Coupon } from "@/types/store.types";
import { CouponFormDialog } from "./CouponFormDialog";
import { CouponViewDialog } from "./CouponViewDialog";
import { cn } from "@/lib/utils";

function activeBadgeClass(isActive: boolean) {
  return isActive
    ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
    : "border-muted bg-muted text-muted-foreground";
}

export default function CouponsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [viewing, setViewing] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const { data, isLoading } = useQuery({ queryKey: ["coupons"], queryFn: () => getCouponsAction() });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateCouponAction(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "Coupon activated" : "Coupon deactivated");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: () => toast.error("Failed to update coupon status"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCouponAction,
    onSuccess: () => {
      toast.success("Coupon deleted");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: () => toast.error("Failed to delete coupon"),
  });

  const coupons = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setFormOpen(true);
  };

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Promotions"
        title="Coupons"
        description="Create discount codes, control availability, and track redemptions."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create promo code
          </Button>
        }
      />

      {coupons.length === 0 ? (
        <EmptyState
          title="No coupons yet"
          description="Create discount codes to boost sales and reward customers."
          actionLabel="Create promo code"
          onAction={openCreate}
          icon={Ticket}
        />
      ) : (
        <DashboardTable label="Promo codes" count={coupons.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min order</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => {
                const expired = c.expiresAt ? new Date(c.expiresAt) < new Date() : false;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-medium">{c.code}</TableCell>
                    <TableCell>
                      {c.type === "PERCENT" ? `${c.value}%` : formatPrice(c.value, currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.minOrder > 0 ? formatPrice(c.minOrder, currency) : "—"}
                    </TableCell>
                    <TableCell>
                      {c.usedCount}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className={activeBadgeClass(c.isActive)}>
                          {c.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {expired ? <Badge variant="destructive">Expired</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewing(c)}
                          aria-label={`View ${c.code}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                          aria-label={`Edit ${c.code}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(!c.isActive && "text-emerald-600 hover:text-emerald-600")}
                          onClick={() =>
                            toggleMutation.mutate({ id: c.id, isActive: !c.isActive })
                          }
                          disabled={toggleMutation.isPending}
                          aria-label={c.isActive ? `Deactivate ${c.code}` : `Activate ${c.code}`}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(c.id)}
                          aria-label={`Delete ${c.code}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DashboardTable>
      )}

      <CouponFormDialog open={formOpen} onOpenChange={setFormOpen} coupon={editing} />

      <CouponViewDialog
        coupon={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
        currency={currency}
        onEdit={openEdit}
      />

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              Customers will no longer be able to use this promo code. This cannot be undone.
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
