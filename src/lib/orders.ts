import { Order } from "@/types/store.types";

export type OrderStatusTab =
  | "all"
  | "placed"
  | "on_hold"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "returned"
  | "payment_on_process"
  | "payment_failed";

export const ORDER_STATUS_TABS: {
  value: OrderStatusTab;
  label: string;
  colorClass?: string;
  statuses?: Order["status"][];
}[] = [
  { value: "all", label: "All Orders" },
  { value: "placed", label: "Placed", statuses: ["PENDING"] },
  { value: "on_hold", label: "On Hold", colorClass: "text-amber-600", statuses: ["PACKED"] },
  { value: "confirmed", label: "Confirmed", colorClass: "text-primary", statuses: ["CONFIRMED"] },
  { value: "shipped", label: "Shipped", colorClass: "text-blue-600", statuses: ["SHIPPED"] },
  { value: "delivered", label: "Delivered", colorClass: "text-emerald-600", statuses: ["DELIVERED"] },
  { value: "completed", label: "Completed", colorClass: "text-emerald-600", statuses: ["DELIVERED"] },
  { value: "cancelled", label: "Cancelled", colorClass: "text-red-600", statuses: ["CANCELLED"] },
  { value: "returned", label: "Returned", colorClass: "text-orange-600" },
  { value: "payment_on_process", label: "Payment OnProcess", colorClass: "text-amber-600", statuses: ["PENDING"] },
  { value: "payment_failed", label: "Payment Failed", colorClass: "text-red-600", statuses: ["CANCELLED"] },
];

export const ORDER_STATUS_OPTIONS: { value: Order["status"]; label: string }[] = [
  { value: "PENDING", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKED", label: "On Hold" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export type OrderSearchField = "all" | "orderNumber" | "customerPhone" | "customerName" | "customerEmail";

export const ORDER_SEARCH_FIELDS: { value: OrderSearchField; label: string }[] = [
  { value: "all", label: "All Fields" },
  { value: "orderNumber", label: "Order ID" },
  { value: "customerPhone", label: "Phone number" },
  { value: "customerName", label: "Customer name" },
  { value: "customerEmail", label: "Email" },
];

export function filterOrdersByTab(orders: Order[], tab: OrderStatusTab): Order[] {
  const config = ORDER_STATUS_TABS.find((t) => t.value === tab);
  if (!config?.statuses) return [];
  return orders.filter((o) => config.statuses!.includes(o.status));
}

export function searchOrders(orders: Order[], term: string, field: OrderSearchField): Order[] {
  const q = term.trim().toLowerCase();
  if (!q) return orders;

  const matches = (value?: string | null) => value?.toLowerCase().includes(q);

  return orders.filter((order) => {
    if (field === "orderNumber") return matches(order.orderNumber);
    if (field === "customerPhone") return matches(order.customerPhone);
    if (field === "customerName") return matches(order.customerName);
    if (field === "customerEmail") return matches(order.customerEmail);
    return (
      matches(order.orderNumber) ||
      matches(order.customerPhone) ||
      matches(order.customerName) ||
      matches(order.customerEmail)
    );
  });
}

export function getOrderStats(orders: Order[]) {
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail.toLowerCase()));

  return {
    totalConfirmed: confirmed.length,
    totalAmount: confirmed.reduce((sum, o) => sum + o.total, 0),
    customersServed: uniqueCustomers.size,
  };
}

export function formatTodayDate() {
  const day = new Date().getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
  return `${day}${suffix} ${month}`;
}

export function exportOrdersCsv(orders: Order[], currency: string) {
  const headers = ["Order ID", "Customer", "Email", "Phone", "Status", "Total", "Date"];
  const rows = orders.map((o) => [
    o.orderNumber,
    o.customerName,
    o.customerEmail,
    o.customerPhone ?? "",
    o.status,
    o.total.toFixed(2),
    new Date(o.createdAt).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orders-${currency}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
