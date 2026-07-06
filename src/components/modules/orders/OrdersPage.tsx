"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownUp,
  Calendar,
  Download,
  Filter,
  Package,
  Plus,
  Search,
  Tag,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrdersAction, getOrderStatsAction, updateOrderStatusAction } from "@/actions/catalog.actions";
import { formatPrice } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { Order } from "@/types/store.types";
import {
  ORDER_SEARCH_FIELDS,
  ORDER_STATUS_TABS,
  OrderSearchField,
  OrderStatusTab,
  exportOrdersCsv,
  filterOrdersByTab,
  formatTodayDate,
  searchOrders,
} from "@/lib/orders";
import { cn } from "@/lib/utils";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

type SortKey = "date" | "total" | "customer";
type SortDir = "asc" | "desc";

const COLUMN_OPTIONS = [
  { key: "orderNumber", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "phone", label: "Phone" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
] as const;

type ColumnKey = (typeof COLUMN_OPTIONS)[number]["key"];

function statusBadgeClass(status: Order["status"]) {
  switch (status) {
    case "PENDING":
      return "border-slate-500/30 bg-slate-500/10 text-slate-700";
    case "CONFIRMED":
      return "border-primary/30 bg-primary/10 text-primary";
    case "PACKED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "SHIPPED":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700";
    case "DELIVERED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "CANCELLED":
      return "border-red-500/30 bg-red-500/10 text-red-700";
    default:
      return "";
  }
}

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

  const [statusTab, setStatusTab] = useState<OrderStatusTab>("all");
  const [searchField, setSearchField] = useState<OrderSearchField>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    orderNumber: true,
    customer: true,
    phone: true,
    total: true,
    status: true,
    date: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrdersAction({ limit: "200", sortBy: "createdAt", sortOrder: "desc" }),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["order-stats"],
    queryFn: getOrderStatsAction,
  });

  useDashboardReady(!isLoading && !statsLoading);

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
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  const allOrders = data?.data ?? [];

  const filteredOrders = useMemo(() => {
    let result = statusTab === "all" ? allOrders : filterOrdersByTab(allOrders, statusTab);
    result = searchOrders(result, search, searchField);

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortKey === "total") {
        cmp = a.total - b.total;
      } else {
        cmp = a.customerName.localeCompare(b.customerName);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [allOrders, statusTab, search, searchField, sortKey, sortDir]);

  const toggleSort = () => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        action={
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Today's date"
          value={formatTodayDate()}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Tag}
          label="Total Orders (Confirmed)"
          value={statsLoading ? "—" : String(stats?.totalConfirmed ?? 0)}
          loading={statsLoading}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Package}
          label="Total Amount"
          value={statsLoading ? "—" : formatPrice(stats?.totalAmount ?? 0, currency)}
          loading={statsLoading}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Users}
          label="Total Customer Served"
          value={statsLoading ? "—" : String(stats?.customersServed ?? 0)}
          loading={statsLoading}
          iconClass="bg-primary/10 text-primary"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 overflow-hidden rounded-lg border bg-background">
          <Select value={searchField} onValueChange={(v) => setSearchField(v as OrderSearchField)}>
            <SelectTrigger className="w-[130px] shrink-0 rounded-none border-0 border-r shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_SEARCH_FIELDS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search with order ID or Phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 pl-9 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="shrink-0"
          onClick={() => exportOrdersCsv(filteredOrders, currency)}
          disabled={filteredOrders.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-muted/50 p-1">
          {ORDER_STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusTab(tab.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                statusTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                statusTab !== tab.value && tab.colorClass,
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sort by</div>
              {([
                { value: "date", label: "Date" },
                { value: "total", label: "Amount" },
                { value: "customer", label: "Customer" },
              ] as const).map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortKey === opt.value}
                  onCheckedChange={() => setSortKey(opt.value)}
                >
                  {opt.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={toggleSort}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {COLUMN_OPTIONS.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns[col.key]}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) => ({ ...prev, [col.key]: checked }))
                  }
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Your order list is currently empty"
          description="Create your first order to start managing sales"
          actionLabel="Create Order"
          actionHref="/dashboard/orders/new"
        />
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No orders match your filters</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting the status tab or search terms.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.orderNumber && <TableHead>Order ID</TableHead>}
                {visibleColumns.customer && <TableHead>Customer</TableHead>}
                {visibleColumns.phone && <TableHead>Phone</TableHead>}
                {visibleColumns.total && <TableHead>Total</TableHead>}
                {visibleColumns.status && <TableHead>Status</TableHead>}
                {visibleColumns.date && <TableHead>Date</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  {visibleColumns.orderNumber && (
                    <TableCell className="align-top font-medium">{order.orderNumber}</TableCell>
                  )}
                  {visibleColumns.customer && (
                    <TableCell className="align-top">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </TableCell>
                  )}
                  {visibleColumns.phone && (
                    <TableCell className="align-top">{order.customerPhone ?? "—"}</TableCell>
                  )}
                  {visibleColumns.total && (
                    <TableCell className="align-top">{formatPrice(order.total, currency)}</TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell className="min-w-[220px] align-top">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusBadgeClass(order.status)}>
                          {order.status}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={(status) =>
                            updateMutation.mutate({
                              id: order.id,
                              status,
                              trackingNumber: order.trackingNumber,
                              trackingCarrier: order.trackingCarrier,
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                      {order.payment && (
                        <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                          <div>
                            Payment: <span className="font-medium text-foreground">{order.payment.status}</span>
                            {" · "}
                            {order.payment.provider}
                          </div>
                          <div className="font-mono">{order.payment.transactionId}</div>
                          {order.payment.paidAt && (
                            <div>Paid {new Date(order.payment.paidAt).toLocaleString()}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell className="align-top">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconClass,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  iconClass: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-6 w-20" />
          ) : (
            <p className="text-lg font-semibold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
