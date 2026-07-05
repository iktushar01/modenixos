"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrdersAction, updateOrderStatusAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { Order } from "@/types/store.types";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

function OrderTrackingFields({
  order,
  onSave,
}: {
  order: Order;
  onSave: (tracking: { trackingNumber?: string; trackingCarrier?: string }) => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingCarrier, setTrackingCarrier] = useState(order.trackingCarrier ?? "");

  if (order.status !== "SHIPPED" && order.status !== "DELIVERED") return null;

  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      <Input
        placeholder="Carrier"
        value={trackingCarrier}
        onChange={(e) => setTrackingCarrier(e.target.value)}
        onBlur={() => onSave({ trackingNumber, trackingCarrier })}
        className="h-8 text-xs"
      />
      <Input
        placeholder="Tracking number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        onBlur={() => onSave({ trackingNumber, trackingCarrier })}
        className="h-8 text-xs"
      />
    </div>
  );
}

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => getOrdersAction() });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      trackingNumber,
      trackingCarrier,
    }: {
      id: string;
      status: string;
      trackingNumber?: string | null;
      trackingCarrier?: string | null;
    }) => updateOrderStatusAction(id, status, { trackingNumber, trackingCarrier }),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage customer orders, status, and shipment tracking." />
      {isLoading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
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
                <TableCell className="align-top font-medium">{order.orderNumber}</TableCell>
                <TableCell className="align-top">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                </TableCell>
                <TableCell className="align-top">{formatPrice(order.total, currency)}</TableCell>
                <TableCell className="min-w-[220px] align-top">
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      updateMutation.mutate({ id: order.id, status, trackingNumber: order.trackingNumber, trackingCarrier: order.trackingCarrier })
                    }
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <OrderTrackingFields
                    order={order}
                    onSave={(tracking) =>
                      updateMutation.mutate({
                        id: order.id,
                        status: order.status,
                        trackingNumber: tracking.trackingNumber,
                        trackingCarrier: tracking.trackingCarrier,
                      })
                    }
                  />
                </TableCell>
                <TableCell className="align-top">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
