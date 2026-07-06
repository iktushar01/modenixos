"use client";

import Link from "next/link";
import {
  BarChart3,
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsOverviewAction, getAnalyticsChartsAction } from "@/actions/catalog.actions";
import { formatPrice, getCurrencyName } from "@/lib/currency";
import { useMyStore } from "@/hooks/useMyStore";
import { DashboardAnalyticsSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";
import { AnalyticsKpiCard } from "./AnalyticsKpiCard";
import { AnalyticsChartsSection } from "./AnalyticsChartsSection";
import { AnalyticsTablesSection } from "./AnalyticsTablesSection";

export default function AnalyticsPage() {
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";
  const { data: overview, isPending: overviewPending } = useDashboardQuery({
    queryKey: ["analytics-overview"],
    queryFn: getAnalyticsOverviewAction,
  });

  const { data: charts, isPending: chartsPending, isError: chartsError } = useDashboardQuery({
    queryKey: ["analytics-charts"],
    queryFn: getAnalyticsChartsAction,
  });

  const showPlaceholder = overviewPending && overview === undefined;

  const periodKpis = [
    {
      label: "Revenue (30d)",
      value: formatPrice(overview?.period.revenue ?? 0, currency),
      icon: DollarSign,
      variant: "warm" as const,
      change: overview?.changes.revenue,
    },
    {
      label: "Orders (30d)",
      value: overview?.period.orders ?? 0,
      icon: ShoppingCart,
      variant: "violet" as const,
      change: overview?.changes.orders,
    },
    {
      label: "New customers (30d)",
      value: overview?.period.newCustomers ?? 0,
      icon: Users,
      variant: "emerald" as const,
      change: overview?.changes.newCustomers,
    },
    {
      label: "Avg. order value",
      value: formatPrice(overview?.period.aov ?? overview?.aov ?? 0, currency),
      icon: Receipt,
      variant: "sky" as const,
      change: overview?.changes.aov,
    },
  ];

  const lifetimeKpis = [
    {
      label: "Lifetime revenue",
      value: formatPrice(overview?.revenue ?? 0, currency),
      icon: TrendingUp,
      variant: "warm" as const,
    },
    {
      label: "Total orders",
      value: overview?.orders ?? 0,
      icon: ShoppingCart,
      variant: "violet" as const,
    },
    {
      label: "Active products",
      value: overview?.products ?? 0,
      icon: Package,
      variant: "sky" as const,
    },
    {
      label: "Total customers",
      value: overview?.customers ?? 0,
      icon: Users,
      variant: "emerald" as const,
    },
  ];

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Revenue trends, product performance, and order activity for your store."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {store?.currency && (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                {store.currency} · {getCurrencyName(store.currency)}
              </Badge>
            )}
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/dashboard/orders">
                <BarChart3 className="h-3.5 w-3.5" />
                All orders
              </Link>
            </Button>
          </div>
        }
      />

      <DashboardAsyncContent
        showPlaceholder={showPlaceholder}
        skeleton={<DashboardAnalyticsSkeleton />}
      >
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Last 30 days</h2>
                <p className="text-sm text-muted-foreground">
                  Compared to the previous 30-day period
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {periodKpis.map((kpi) => (
                <AnalyticsKpiCard key={kpi.label} {...kpi} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Lifetime totals</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {lifetimeKpis.map((kpi) => (
                <AnalyticsKpiCard key={kpi.label} {...kpi} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Performance charts</h2>
                <p className="text-sm text-muted-foreground">
                  Revenue, orders, and fulfillment breakdown
                </p>
              </div>
            </div>

            {chartsPending && !charts ? (
              <Card className="dashboard-panel">
                <CardContent className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                  Loading charts…
                </CardContent>
              </Card>
            ) : chartsError ? (
              <Card className="dashboard-panel">
                <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  Could not load charts. Refresh the page to try again.
                </CardContent>
              </Card>
            ) : charts && overview ? (
              <AnalyticsChartsSection charts={charts} overview={overview} currency={currency} />
            ) : (
              <Card className="dashboard-panel">
                <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  No chart data yet. Orders will populate these charts over time.
                </CardContent>
              </Card>
            )}
          </section>

          {overview && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Product & order insights</h2>
              <AnalyticsTablesSection overview={overview} currency={currency} />
            </section>
          )}

          {overview && overview.orderStatusBreakdown.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Quick insights</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InsightCard
                  title="30-day revenue"
                  value={formatPrice(overview.period.revenue, currency)}
                  detail={`${overview.period.orders} orders in the last 30 days`}
                />
                <InsightCard
                  title="Catalog size"
                  value={String(overview.products)}
                  detail={`${overview.customers} registered customers`}
                />
                <InsightCard
                  title="Pending fulfillment"
                  value={String(
                    overview.orderStatusBreakdown.find((s) => s.status === "PENDING")?.count ??
                      overview.orderStatusBreakdown.find((s) => s.status === "CONFIRMED")?.count ??
                      0,
                  )}
                  detail="Orders awaiting processing"
                />
              </div>
            </section>
          )}
        </div>
      </DashboardAsyncContent>
    </div>
  );
}

function InsightCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="dashboard-panel dashboard-panel-hover border-0 bg-transparent shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
