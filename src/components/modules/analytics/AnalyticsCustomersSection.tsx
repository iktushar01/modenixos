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

interface AnalyticsCustomersSectionProps {
  overview: AnalyticsOverview;
  currency: string;
}

export function AnalyticsCustomersSection({ overview, currency }: AnalyticsCustomersSectionProps) {
  const customers = overview.topCustomers;

  return (
    <Card className="dashboard-panel border-0 bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Top customers</CardTitle>
        <CardDescription>Highest spenders in the selected period</CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No customer orders in this period yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Last order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{customer.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{customer.orderCount}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatPrice(customer.revenue, currency)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(customer.lastOrderAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
