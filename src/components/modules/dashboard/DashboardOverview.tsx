"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { getAnalyticsOverviewAction } from "@/actions/catalog.actions";
import { useMyStore } from "@/hooks/useMyStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const { data: store } = useMyStore();
  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverviewAction,
  });

  const stats = [
    { label: "Revenue", value: `$${(overview?.revenue ?? 0).toFixed(2)}`, icon: DollarSign },
    { label: "Orders", value: overview?.orders ?? 0, icon: ShoppingCart },
    { label: "Products", value: overview?.products ?? 0, icon: Package },
    { label: "Customers", value: overview?.customers ?? 0, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={store?.brandName ?? "Dashboard"}
        description="Overview of your fashion brand performance."
        action={
          store?.slug && (
            <Button asChild variant="outline">
              <Link href={`/store/${store.slug}`} target="_blank">View Storefront</Link>
            </Button>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {overview?.recentOrders && overview.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{order.status}</Badge>
                  <p className="mt-1 text-sm font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
