import type { Order } from "@/types/store.types";

export function formatTrend(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return { label: "No prior data", positive: null as boolean | null };
  }
  const positive = value >= 0;
  return {
    label: `${positive ? "+" : ""}${value.toFixed(1)}% vs prior 30d`,
    positive,
  };
}

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<Order["status"], string> = {
  PENDING: "hsl(var(--chart-4))",
  CONFIRMED: "hsl(var(--chart-1))",
  PACKED: "hsl(var(--chart-2))",
  SHIPPED: "hsl(var(--chart-3))",
  DELIVERED: "hsl(142 76% 36%)",
  CANCELLED: "hsl(0 72% 51%)",
};
