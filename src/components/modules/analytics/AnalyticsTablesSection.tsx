"use client";

import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AnalyticsOverview } from "@/types/store.types";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_LABELS } from "./analytics.utils";

interface AnalyticsTablesSectionProps {
  overview: AnalyticsOverview;
  currency: string;
}

export function AnalyticsTablesSection({ overview, currency }: AnalyticsTablesSectionProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div>
            <CardTitle>Best sellers</CardTitle>
            <CardDescription>Top products by units sold (90 days)</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/dashboard/products">
              Products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {overview.bestSellers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Package className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No sales data yet. Orders will appear here.</p>
              <Button asChild size="sm">
                <Link href="/dashboard/products/new">Add a product</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.bestSellers.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="max-w-[180px] truncate font-medium">{item.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(item.revenue, currency)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {item.share}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest activity across your store</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/dashboard/orders">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {overview.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No orders yet. Share your storefront to get sales.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/store">Manage storefront</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {overview.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/dashboard/orders"
                  className="dashboard-list-item group justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="truncate text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant="outline" className="border-border/60">
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                    <p className="mt-1 text-sm font-semibold tabular-nums">
                      {formatPrice(order.total, currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
