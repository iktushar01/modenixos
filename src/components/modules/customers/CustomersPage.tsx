"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
import { getCustomersAction, deleteCustomerAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { Customer } from "@/types/store.types";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";
import { cn } from "@/lib/utils";

type AccountFilter = "all" | "registered" | "guest";

const FILTER_OPTIONS: { value: AccountFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "registered", label: "Login accounts" },
  { value: "guest", label: "Guest only" },
];

function formatJoinedDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const [filter, setFilter] = useState<AccountFilter>("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      limit: "100",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    if (filter === "registered") params.hasAccount = "true";
    if (filter === "guest") params.hasAccount = "false";
    if (search.trim()) params.searchTerm = search.trim();
    return params;
  }, [filter, search]);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", queryParams],
    queryFn: () => getCustomersAction(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerAction,
    onSuccess: () => {
      toast.success("Customer deleted");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => toast.error("Failed to delete customer"),
  });

  const customers = data?.data ?? [];
  const registeredCount = customers.filter((c) => c.hasAccount).length;

  useDashboardReady(!isLoading);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage storefront login accounts and guest shoppers. Registered customers can log in, save a wishlist, and leave reviews."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create login account
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={cn(filter !== option.value && "bg-transparent")}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {!isLoading && customers.length > 0 && filter === "all" && (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{customers.length} total</span>
          <span>·</span>
          <span>{registeredCount} with login accounts</span>
          <span>·</span>
          <span>{customers.length - registeredCount} guest checkout only</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          title={filter === "registered" ? "No login accounts yet" : "No customers yet"}
          description={
            filter === "registered"
              ? "Create a login account or wait for shoppers to register on your storefront."
              : "Customers appear when someone registers on your storefront or completes guest checkout."
          }
          actionLabel={filter !== "guest" ? "Create login account" : undefined}
          onAction={filter !== "guest" ? openCreate : undefined}
          icon={Users}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Lifetime value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone || "—"}</TableCell>
                  <TableCell>
                    {c.hasAccount ? (
                      <Badge variant="secondary">Registered</Badge>
                    ) : (
                      <Badge variant="outline">Guest</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatJoinedDate(c.createdAt)}
                  </TableCell>
                  <TableCell>{c.orderCount}</TableCell>
                  <TableCell>{formatPrice(c.totalSpent, currency)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/customers/${c.id}`} aria-label="View customer">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} aria-label="Edit customer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(c)}
                        aria-label="Delete customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editing} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} ({deleteTarget?.email}) will be permanently removed.
              {deleteTarget?.hasAccount
                ? " Their login access and wishlist will be deleted. Order history is kept."
                : " Order history is kept."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
