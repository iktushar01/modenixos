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
  PENDING: "var(--chart-4)",
  CONFIRMED: "var(--chart-1)",
  PACKED: "var(--chart-2)",
  SHIPPED: "var(--chart-3)",
  DELIVERED: "var(--chart-2)",
  CANCELLED: "var(--chart-5)",
};
