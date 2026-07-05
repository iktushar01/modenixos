"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomersAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";

function formatJoinedDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomersPage() {
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomersAction({ limit: "100", sort: "-createdAt" }),
  });
  const customers = data?.data ?? [];
  const registeredCount = customers.filter((c) => c.hasAccount).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Shoppers who registered on your storefront or placed orders. Registered accounts can log in, save a wishlist, and leave reviews."
      />

      {!isLoading && customers.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{customers.length} total</span>
          <span>·</span>
          <span>{registeredCount} with store accounts</span>
          <span>·</span>
          <span>{customers.length - registeredCount} guest checkout only</span>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading customers…</p>
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customers appear when someone registers on your storefront or completes guest checkout."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Lifetime value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
