"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomersAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";

export default function CustomersPage() {
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: () => getCustomersAction() });
  const customers = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="View customers who have placed orders." />
      {isLoading ? <p>Loading...</p> : customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers are created automatically when orders are placed." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Lifetime Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.orderCount}</TableCell>
                <TableCell>{formatPrice(c.totalSpent, currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
