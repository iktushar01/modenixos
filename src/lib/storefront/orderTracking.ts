import { Order } from "@/types/store.types";

export type OrderStatus = Order["status"];

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  PENDING: "We received your order and will confirm it shortly.",
  CONFIRMED: "Your order is confirmed and being prepared.",
  PACKED: "Your items are packed and ready to ship.",
  SHIPPED: "Your package is on the way.",
  DELIVERED: "Your order has been delivered.",
  CANCELLED: "This order was cancelled.",
};

export function getOrderProgress(status: OrderStatus): number {
  if (status === "CANCELLED") return 0;
  const index = ORDER_STATUS_FLOW.indexOf(status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / ORDER_STATUS_FLOW.length) * 100);
}

export function isOrderStatusComplete(current: OrderStatus, step: OrderStatus): boolean {
  if (current === "CANCELLED") return false;
  const currentIndex = ORDER_STATUS_FLOW.indexOf(current);
  const stepIndex = ORDER_STATUS_FLOW.indexOf(step);
  return currentIndex >= stepIndex;
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShippingAddress(address: Record<string, string>) {
  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(", "),
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join("\n");
}
