"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrdersAction, updateOrderStatusAction } from "@/actions/catalog.actions";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => getOrdersAction() });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatusAction(id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage customer orders and fulfillment." />
      {isLoading ? <p>Loading...</p> : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders from your storefront will appear here." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(status) => updateMutation.mutate({ id: order.id, status })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
