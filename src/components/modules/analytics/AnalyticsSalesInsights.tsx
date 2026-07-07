"use client";

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

interface AnalyticsSalesInsightsProps {
  overview: AnalyticsOverview;
  currency: string;
}

function formatPaymentMethod(method: string) {
  if (method === "COD") return "Cash on delivery";
  if (method === "SSLCOMMERZ") return "Online (SSLCommerz)";
  return method.replace(/_/g, " ");
}

export function AnalyticsSalesInsights({ overview, currency }: AnalyticsSalesInsightsProps) {
  const { paymentMethodBreakdown, geoBreakdown, fulfillment } = overview;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="dashboard-panel border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
          <CardDescription>Revenue split by payment type</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethodBreakdown.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders in this period.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethodBreakdown.map((row) => (
                  <TableRow key={row.method}>
                    <TableCell>{formatPaymentMethod(row.method)}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(row.revenue, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-panel border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>Top regions</CardTitle>
          <CardDescription>Orders by shipping country</CardDescription>
        </CardHeader>
        <CardContent>
          {geoBreakdown.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No shipping data yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geoBreakdown.map((row) => (
                  <TableRow key={row.country}>
                    <TableCell>{row.country}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.orders}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPrice(row.revenue, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-panel border-0 bg-transparent shadow-none xl:col-span-2">
        <CardHeader>
          <CardTitle>Fulfillment</CardTitle>
          <CardDescription>Shipping performance in the selected period</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Shipped orders</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{fulfillment.shippedOrders}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Avg. time to ship</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {fulfillment.avgHoursToShip != null ? `${fulfillment.avgHoursToShip}h` : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
