"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { DollarSign, Package, Pencil, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

      {store && (
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {store.logo ? (
                <Image src={store.logo} alt={store.brandName} fill className="object-contain p-1.5" unoptimized />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">{store.brandName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle>{store.brandName}</CardTitle>
              <CardDescription>
                /store/{store.slug}
                {store.isPublished ? (
                  <Badge variant="secondary" className="ml-2">Published</Badge>
                ) : (
                  <Badge variant="outline" className="ml-2">Draft</Badge>
                )}
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 gap-1.5">
              <Link href="/dashboard/store">
                <Pencil className="h-3.5 w-3.5" />
                Edit shop
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/store/branding">Branding</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/store/appearance">Appearance</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
