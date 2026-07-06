"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCustomerAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { useState } from "react";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerDetailPage({ customerId }: { customerId: string }) {
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerAction(customerId),
  });

  const customer = data?.data;

  useDashboardReady(!isLoading);

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (isError || !customer) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>
        <EmptyState
          title="Customer not found"
          description="This customer may have been removed or you no longer have access."
        />
      </div>
    );
  }

  const orders = customer.orders ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        description={customer.email}
        action={
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit customer
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-5">
          <p className="text-xs text-muted-foreground">Account status</p>
          <div className="mt-2">
            {customer.hasAccount ? (
              <Badge variant="secondary">Registered login</Badge>
            ) : (
              <Badge variant="outline">Guest only</Badge>
            )}
          </div>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="mt-2 font-medium">{formatDate(customer.createdAt)}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-xs text-muted-foreground">Orders</p>
          <p className="mt-2 font-medium">{customer.orderCount}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-xs text-muted-foreground">Lifetime value</p>
          <p className="mt-2 font-medium">{formatPrice(customer.totalSpent, currency)}</p>
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Contact</h2>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{customer.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">{customer.phone || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders placed yet.</p>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/orders`} className="hover:underline">
                        #{order.orderNumber ?? order.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.total, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={customer} />
    </div>
  );
}
